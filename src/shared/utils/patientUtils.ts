import {
  DETAIL_EMPTY_VALUE,
  DETAIL_IDENTITY_SEPARATOR,
} from '@/shared/constants/common';
import {
  ASSIGNMENT_DATE_FORMAT,
  ASSIGNMENT_FREQUENCY_OPTIONS,
  HHA_DERIVED_PATIENT_PAYLOAD_FIELDS,
  HHA_MANAGED_PATIENT_LINK_PAYLOAD_FIELDS,
  HHA_MANAGED_PATIENT_PAYLOAD_FIELDS,
  PATIENT_GENDER_OPTIONS,
  PATIENT_SOURCE,
  PATIENT_STATUS,
} from '@/shared/constants/patients';
import {SelectOption} from '@/shared/interfaces/inputs';
import {
  Patient,
  PatientAssignmentRecord,
  PatientStaffRef,
} from '@/shared/interfaces/patient';
import {PatientCareTeamMember} from '@/shared/interfaces/patientDetails';
import {DetailFact} from '@/shared/interfaces/uiComponents';
import {
  PatientAssignmentFormItem,
  PatientFormPayload,
  PatientIdentityPart,
} from '@/shared/types/patient';
import {formatDate, getAgeInYears, toDateTime} from '@/shared/utils/dateUtils';
import {getFullName} from '@/shared/utils/general';
import {
  buildHhaManagedFields,
  omitHhaManagedFields,
} from '@/shared/utils/hhaManagedFieldsUtils';

/** Whether HHAeXchange owns this patient's demographics and links. */
export const isHhaManagedPatient = ({patient}: {patient?: Patient | null}) =>
  patient?.source === PATIENT_SOURCE.hhaExchange.value;

/** HHAeXchange's nurse holds the patient and is not being waited for. */
export const isPatientPrimaryNurseLocked = ({
  patient,
}: {
  patient?: Patient | null;
}) =>
  isHhaManagedPatient({patient}) &&
  Boolean(patient?.isPrimaryNurseHhaManaged) &&
  !patient?.hhaPendingNurse;

/**
 * An HHA patient's case manager can be edited only while the patient waits for
 * HHAeXchange's one, or holds one an admin picked. Mirrors the backend guard.
 */
export const isPatientCaseManagerLocked = ({
  patient,
}: {
  patient?: Patient | null;
}) =>
  !patient?.hhaPendingCaseManager &&
  (!patient?.caseManager || Boolean(patient?.isCaseManagerHhaManaged));

/**
 * Whether a patient can receive new checklist assignments.
 * Only active (and non-archived) patients are assignable — inactive,
 * discharged, or archived patients are blocked.
 */
export const isPatientAssignable = ({
  status,
  archived,
}: {
  status?: string;
  archived?: boolean;
}): boolean =>
  !archived && status?.toLowerCase() === PATIENT_STATUS.active.value;

/** Display name of a nurse / case manager / caregiver reference, or ''. */
export const getStaffName = ({staff}: {staff?: PatientStaffRef | null}) =>
  staff?.user
    ? getFullName({
        firstName: staff.user.firstName,
        lastName: staff.user.lastName,
      })
    : '';

/**
 * Transforms a backend patient API response into the frontend Patient interface.
 * Flattens nested county/region objects to match the Patient shape.
 */
export const transformPatientResponse = ({
  patient,
}: {
  patient: any;
}): Patient => {
  const assignedCaregivers: PatientStaffRef[] =
    patient.assignedCaregivers || [];

  return {
    ...patient,
    dob: patient.dateOfBirth || '',
    gender: patient.gender || '',
    county: patient.county?.id || '',
    countyName: patient.county?.name || '',

    // Some responses carry the region on the patient, others under the county.
    assignedRegion: patient.region?.name || patient.county?.region?.name || '',
    assignedRegionId: patient.region?.id || patient.county?.region?.id || '',
    primaryNurseProfileId: patient.primaryNurseProfileId || null,
    secondaryNurseProfileId: patient.secondaryNurseProfileId || null,
    primaryNurseName: getStaffName({staff: patient.primaryNurse}),
    secondaryNurseName: getStaffName({staff: patient.secondaryNurse}),
    caseManagerName: getStaffName({staff: patient.caseManager}),
    assignedCaregiverNames: assignedCaregivers
      .map((staff) => getStaffName({staff}))
      .filter(Boolean),
    streetAddress: patient.address || '',
    deletedAt: patient.deletedAt || null,
    archived: Boolean(patient.archived ?? patient.deletedAt),
    diagnosis: patient.diagnoses || '',
    lastFlag: patient.lastFlag ?? null,
  };
};

/**
 * The drawer's patient after a save. An update answers with only id and names,
 * so it is merged over the patient already held: replacing it would drop
 * `source` and send the next save as a non-HHA payload that the backend 400s.
 */
export const mergeSavedPatient = ({
  savedPatient,
  rawPatient,
}: {
  savedPatient: Patient | null;
  rawPatient: Partial<Patient>;
}): Patient => {
  const saved = transformPatientResponse({patient: rawPatient});

  if (!savedPatient) return saved;

  return Object.assign({}, savedPatient, {
    id: saved.id,
    firstName: saved.firstName,
    lastName: saved.lastName,
  });
};

/**
 * Builds the patient payload for create/update operations.
 * Maps frontend form field names to backend API field names.
 *
 * For an HHA-sourced patient the fields HHAeXchange owns are dropped entirely:
 * demographics, the primary nurse while HHAeXchange names it, and the county
 * while it is HHA-derived.
 *
 * Dropping rather than merely disabling them in the form is load-bearing: the
 * backend rejects a payload that CONTAINS a managed field, not one that changes
 * it, and a disabled MUI input still submits its value through react-hook-form.
 *
 * `patient` is absent on create — a patient created here is MANUAL.
 */
export const generatePatientPayload = ({
  data,
  patient = null,
}: {
  data: PatientFormPayload;
  patient?: Patient | null;
}) =>
  omitHhaManagedFields({
    payload: Object.assign(
      buildFullPatientPayload({data}),
      buildCaseManagerPayload({data, patient})
    ),
    isHhaManaged: isHhaManagedPatient({patient}),
    managedFields: buildHhaManagedFields({
      baseFields: HHA_MANAGED_PATIENT_PAYLOAD_FIELDS,
      conditionalFields: [
        {
          fields: HHA_MANAGED_PATIENT_LINK_PAYLOAD_FIELDS,
          when: isPatientPrimaryNurseLocked({patient}),
        },
        {
          fields: HHA_DERIVED_PATIENT_PAYLOAD_FIELDS,
          when: Boolean(patient?.isCountyHhaManaged),
        },
      ],
    }),
  });

/**
 * The case manager is sent only when an admin changed it on an HHA patient
 * whose field is editable: any other patient's is set from the case manager's
 * own page, and re-sending the loaded one would mark it as the admin's pick.
 */
const buildCaseManagerPayload = ({
  data,
  patient,
}: {
  data: PatientFormPayload;
  patient: Patient | null;
}): {caseManagerProfileId?: string | null} => {
  const isEditable =
    isHhaManagedPatient({patient}) && !isPatientCaseManagerLocked({patient});

  const picked = data.caseManagerProfileId || '';

  return isEditable && picked !== (patient?.caseManager?.id || '')
    ? {caseManagerProfileId: picked || null}
    : {};
};

const buildFullPatientPayload = ({data}: {data: PatientFormPayload}) => ({
  firstName: data.firstName,
  lastName: data.lastName,
  dateOfBirth: data.dob,
  gender: data.gender,
  countyId: data.county,
  status: data.status?.toUpperCase(),
  address: data.streetAddress || undefined,
  city: data.city || undefined,
  zipCode: data.zipCode || undefined,
  phoneNo: data.phoneNo || null,
  emergencyContact: data.emergencyContact || null,
  medicaidId: data.medicaidId || undefined,
  diagnoses: data.diagnoses || undefined,
  notes: data.notes || undefined,

  // Empty string = "no nurse selected"; backend wants null to clear the FK.
  primaryNurseProfileId: data.primaryNurseProfileId || null,
  secondaryNurseProfileId: data.secondaryNurseProfileId || null,
});

/**
 * Generates form default values from a Patient entity, or an empty form when
 * adding a patient.
 */
export const generatePatientFormDefaults = ({
  patient,
}: {
  patient?: Patient | null;
}): PatientFormPayload => ({
  firstName: patient?.firstName || '',
  lastName: patient?.lastName || '',
  dob: patient?.dob || null,
  gender: patient?.gender || '',
  county: patient?.county || '',
  assignedRegion: patient?.assignedRegion || '',
  primaryNurseProfileId: patient?.primaryNurseProfileId || '',
  secondaryNurseProfileId: patient?.secondaryNurseProfileId || '',
  caseManagerProfileId: patient?.caseManager?.id || '',
  status: patient?.status?.toLowerCase() || PATIENT_STATUS.active.value,
  streetAddress: patient?.streetAddress || '',
  city: patient?.city || '',
  zipCode: patient?.zipCode || '',
  phoneNo: patient?.phoneNo || '',
  emergencyContact: patient?.emergencyContact || '',
  medicaidId: patient?.medicaidId || '',
  diagnoses: patient?.diagnoses || '',
  notes: patient?.notes || '',
});

export const resolveAssignmentTemplateName = ({
  assignment,
  checklistTemplateOptions,
}: {
  assignment: PatientAssignmentRecord;
  checklistTemplateOptions: SelectOption[];
}): string =>
  assignment.checklistTemplate?.title ||
  checklistTemplateOptions.find(
    (option) => option.value === assignment.checklistTemplateId
  )?.label ||
  assignment.checklistTemplateId;

export const resolveAssignmentCaregiverName = ({
  assignment,
}: {
  assignment: PatientAssignmentRecord;
}): string =>
  getFullName({
    firstName: assignment.caregiverProfile?.user?.firstName,
    lastName: assignment.caregiverProfile?.user?.lastName,
  }) || assignment.caregiverProfileId;

export const getSelectOptionLabel = ({
  options,
  value,
}: {
  options: SelectOption[];
  value: string;
}): string => options.find((option) => option.value === value)?.label || '';

export const formatAssignmentFrequency = ({
  frequency,
}: {
  frequency?: string;
}): string =>
  getSelectOptionLabel({
    options: ASSIGNMENT_FREQUENCY_OPTIONS,
    value: frequency || '',
  }) ||
  frequency ||
  '';

export const formatAssignmentDate = ({value}: {value: unknown}): string =>
  toDateTime({value})?.toFormat(ASSIGNMENT_DATE_FORMAT) || DETAIL_EMPTY_VALUE;

export const createEmptyPatientAssignment = (): PatientAssignmentFormItem => ({
  checklistTemplateId: '',
  caregiverId: '',
  caregiverName: '',
  frequency: '',
  startDate: null,
  endDate: null,
  notes: '',
});

export const generatePatientAssignmentsPayload = ({
  assignments,
  patientId,
}: {
  assignments: PatientAssignmentFormItem[];
  patientId: string;
}) => ({
  assignments: assignments.map((assignment) => ({
    checklistTemplateId: assignment.checklistTemplateId,
    patientId,
    caregiverProfileId: assignment.caregiverId,
    type: assignment.frequency,
    startDate: assignment.startDate,
    endDate: assignment.endDate,
    notes: assignment.notes || null,
  })),
});

/**
 * The recorded sex as a readable word. The API stores it uppercase, so it can
 * never be shown raw.
 */
export const formatGenderLabel = ({gender}: {gender?: string}): string =>
  PATIENT_GENDER_OPTIONS.find((option) => option.value === gender)?.label || '';

/**
 * The one line that identifies a patient wherever they are listed or opened:
 * age, sex and the recorded diagnoses, dropping whichever the record does not
 * carry. Built once so the list row and the record header cannot drift apart.
 */
export const buildPatientIdentityLine = ({
  patient,
  parts = ['age', 'gender', 'diagnoses'],
}: {
  patient: Patient;

  /** Which facts, in this order. The caregiver's rows keep it to two. */
  parts?: PatientIdentityPart[];
}): string => {
  const age = getAgeInYears({dob: patient.dob});

  const values: Record<PatientIdentityPart, string> = {
    age: age === null ? '' : `${age}`,
    gender: formatGenderLabel({gender: patient.gender}),
    diagnoses: patient.diagnoses || patient.diagnosis || '',
    county: patient.countyName || '',
  };

  return parts
    .map((part) => values[part])
    .filter(Boolean)
    .join(DETAIL_IDENTITY_SEPARATOR);
};

/**
 * The status a patient record shows. Archived outranks whatever status the
 * record was left on, so one patient is never Active in the heading and
 * Archived a row away. An unknown status reads as active.
 */
export const getPatientStatusConfig = ({patient}: {patient: Patient}) => {
  if (patient.archived) return PATIENT_STATUS.archived;

  return (
    PATIENT_STATUS[
      patient.status?.toLowerCase() as keyof typeof PATIENT_STATUS
    ] ?? PATIENT_STATUS.active
  );
};

/**
 * The patient's own facts, in the order the rail states them. Built once so the
 * office page and the caregiver page cannot show different records of the same
 * person.
 *
 * `includeNotes` is how the two pages differ: the note is the office's own
 * working note, so a page a caregiver reads asks for the facts without it.
 */
/** Date of birth, gender, phone and email. */
export const buildPatientContactFacts = ({
  patient,
  t,
}: {
  patient: Patient;
  t: (key: string) => string;
}): DetailFact[] => [
  {
    label: t('patients.details.dob'),
    value: patient.dob ? formatDate({date: patient.dob}) : DETAIL_EMPTY_VALUE,
  },
  {
    label: t('patients.details.gender'),
    value: formatGenderLabel({gender: patient.gender}) || DETAIL_EMPTY_VALUE,
  },
  {
    label: t('patients.details.phone'),
    value: patient.phoneNo || DETAIL_EMPTY_VALUE,
  },
  {
    label: t('patients.details.email'),
    value: patient.email || DETAIL_EMPTY_VALUE,
  },
];

/** County and region. */
export const buildPatientLocationFacts = ({
  patient,
  t,
}: {
  patient: Patient;
  t: (key: string) => string;
}): DetailFact[] => [
  {
    label: t('patients.details.county'),
    value: patient.countyName || DETAIL_EMPTY_VALUE,
  },
  {
    label: t('patients.details.region'),
    value: patient.assignedRegion || DETAIL_EMPTY_VALUE,
  },
];

/**
 * What a side panel shows next to the patient while someone works on their
 * checklist or task: contact facts, then where they live.
 */
export const buildPatientPanelFacts = ({
  patient,
  t,
}: {
  patient: Patient;
  t: (key: string) => string;
}): DetailFact[] =>
  buildPatientContactFacts({patient, t}).concat(
    buildPatientLocationFacts({patient, t})
  );

export const buildPatientFacts = ({
  patient,
  t,
  includeNotes = true,
}: {
  patient: Patient;
  t: (key: string) => string;
  includeNotes?: boolean;
}): DetailFact[] => {
  const fullAddress = [patient.streetAddress, patient.city, patient.zipCode]
    .filter(Boolean)
    .join(', ');

  return buildPatientContactFacts({patient, t}).concat(
    [
      {
        label: t('patients.details.emergencyContact'),
        value: patient.emergencyContact || DETAIL_EMPTY_VALUE,
      },
    ],
    buildPatientLocationFacts({patient, t}),
    [
      {
        label: t('patients.details.medicaidId'),
        value: patient.medicaidId || DETAIL_EMPTY_VALUE,
      },
      {
        label: t('patients.details.address'),
        value: fullAddress || DETAIL_EMPTY_VALUE,
      },
      {
        label: t('patients.details.diagnoses'),
        value: patient.diagnoses || patient.diagnosis || DETAIL_EMPTY_VALUE,
      },
      ...(includeNotes && patient.notes
        ? [
            {
              label: t('patients.details.notes'),
              value: patient.notes,
              wide: true,
            },
          ]
        : []),
    ]
  );
};

/**
 * Who is assigned to the patient: nurses, the case manager and every
 * caregiver. Empty slots are left out. The caregiver's own view leaves
 * caregivers out and adds herself instead.
 */
export const buildPatientCareTeam = ({
  patient,
  t,
  includeCaregivers = true,
}: {
  patient: Patient;
  t: (key: string) => string;
  includeCaregivers?: boolean;
}): PatientCareTeamMember[] => {
  const caregiverRole = t('patients.details.caregiver');

  const caregivers = includeCaregivers
    ? (patient.assignedCaregiverNames || []).map((name) => ({
        role: caregiverRole,
        name,
      }))
    : [];

  return [
    {
      role: t('patients.details.primaryNurse'),
      name: patient.primaryNurseName || '',
    },
    {
      role: t('patients.details.secondaryNurse'),
      name: patient.secondaryNurseName || '',
    },
    {
      role: t('patients.details.caseManager'),
      name: patient.caseManagerName || '',
    },
  ]
    .concat(caregivers)
    .filter((member) => member.name);
};

/**
 * The patient a checklist submission is about, from the submission's own
 * nested patient. Enough for the banner without a second request.
 */
export const buildPatientFromSubmission = ({
  submission,
}: {
  submission: any;
}): Patient => ({
  id: submission.patientId,
  firstName: submission.patient?.firstName || '',
  lastName: submission.patient?.lastName || '',
  county: '',
  status: '',
  dob: '',
  diagnosis: '',
  lastFlag: null,
});
