import {
  DATE_FORMATS,
  DETAIL_EMPTY_VALUE,
  DETAIL_IDENTITY_SEPARATOR,
} from '@/shared/constants/common';
import {TIMELINE_TIMESTAMP_FORMAT} from '@/shared/constants/flag';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  AlertPeople,
  UseAlertPeopleParams,
} from '@/shared/interfaces/alertReview';
import {formatDate, getAgeInYears} from '@/shared/utils/dateUtils';
import {getFullName} from '@/shared/utils/general';
import {getStaffName} from '@/shared/utils/patientUtils';

const useAlertPeople = ({
  patient,
  submitter,
  reportedAt,
  showPatientRecord,
}: UseAlertPeopleParams): AlertPeople => {
  const {t} = useTranslation();

  const patientName = getFullName({
    firstName: patient?.firstName,
    lastName: patient?.lastName,
  });

  const caregiverName = getFullName({
    firstName: submitter?.firstName,
    lastName: submitter?.lastName,
  });

  const patientAddress = [patient?.address, patient?.city]
    .filter(Boolean)
    .join(', ');

  const patientAge = getAgeInYears({dob: patient?.dateOfBirth || undefined});

  // Date of birth, then the age it works out to: "14 Mar 1942 · 84".
  const patientDobAge = patient?.dateOfBirth
    ? [
        formatDate({date: patient.dateOfBirth, format: DATE_FORMATS.day}),
        patientAge,
      ]
        .filter((part) => part !== null)
        .join(DETAIL_IDENTITY_SEPARATOR)
    : '';

  const caregiverNames = (patient?.assignedCaregivers || [])
    .map((staff) => getStaffName({staff}))
    .filter(Boolean)
    .join(', ');

  const contactFacts = [
    {label: t('alertReview.people.contact'), value: patient?.phoneNo || ''},
    {label: t('alertReview.people.address'), value: patientAddress},
  ];

  // The whole record, one fact a row, with the care team named by role. A row
  // the record does not carry reads as a dash rather than going missing.
  const patientRecordFacts = [
    {label: t('alertReview.people.dobAge'), value: patientDobAge},
    {
      label: t('alertReview.people.medicaidId'),
      value: patient?.medicaidId || '',
    },
    {
      label: t('alertReview.people.conditions'),
      value: patient?.diagnoses || '',
    },
    ...contactFacts,
    {
      label: t('alertReview.people.emergencyContact'),
      value: patient?.emergencyContact || '',
    },
    {
      label: t('alertReview.people.primaryNurse'),
      value: getStaffName({staff: patient?.primaryNurse}),
    },
    {
      label: t('alertReview.people.secondaryNurse'),
      value: getStaffName({staff: patient?.secondaryNurse}),
    },
    {
      label: t('alertReview.people.caseManager'),
      value: getStaffName({staff: patient?.caseManager}),
    },
    {label: t('alertReview.people.caregivers'), value: caregiverNames},
  ].map((fact) => ({...fact, value: fact.value || DETAIL_EMPTY_VALUE}));

  const patientFacts = showPatientRecord
    ? patientRecordFacts
    : contactFacts.filter((fact) => Boolean(fact.value));

  const reporterFacts = [
    {label: t('alertReview.people.caregiver'), value: caregiverName},
    {label: t('alertReview.people.contact'), value: submitter?.phoneNo || ''},
    {label: t('alertReview.people.email'), value: submitter?.email || ''},
    {
      label: t('alertReview.people.reportedAt'),
      value: reportedAt
        ? formatDate({date: reportedAt, format: TIMELINE_TIMESTAMP_FORMAT})
        : '',
    },
  ].filter((fact) => Boolean(fact.value));

  return {
    patientName,
    caregiverName,
    patientFacts,
    reporterFacts,
    hasPatientRecord: Boolean(showPatientRecord),
  };
};

export default useAlertPeople;
