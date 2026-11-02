import {ReactNode} from 'react';

import {Control, FieldArrayWithId} from 'react-hook-form';

import {ThemeColor} from '@/@core/theme/types';
import {PatientViewVariant} from '@/shared/constants/patients';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {
  CaregiverPatientWorkload,
  CaregiverWorkloadStatus,
} from '@/shared/interfaces/caregiverChecklist';
import {UserRef} from '@/shared/interfaces/common';
import {HhaPatientCoordinator} from '@/shared/interfaces/hhaSyncHistory';
import {SelectOption} from '@/shared/interfaces/inputs';
import {BaseModalProps} from '@/shared/interfaces/modals';
import {
  RowActionsProps,
  TableTitleProps,
  ToolbarTableUIProps,
} from '@/shared/interfaces/tables';
import {
  PatientAssignmentsFormPayload,
  PatientDrawerStep,
  PatientFormPayload,
} from '@/shared/types/patient';
import {RowAction} from '@/shared/types/tables';

// Patient dashboard stats from GET /patients/stats
export interface PatientStats {
  patients: number;
  activeRedFlags: number;
  activeYellowFlags: number;
  greenFlags: number;
  slaBreaches?: number | null;
  averageResolutionMinutes?: number | null;
}

// Minimal staff reference returned alongside a patient: a nurse, the case
// manager or a caregiver (profile id + user name).
export interface PatientStaffRef {
  id: string;
  user?: UserRef;
}

// One event in a patient's activity timeline from GET /patients/:id/timeline. `refId`
// points at the record the event is about (flag, assignment, visit, ...) and
// `flag` is only present on FLAG_RAISED.
export interface PatientTimelineEntry {
  type: string;
  at: string;
  user: Pick<UserRef, 'firstName' | 'lastName'> | null;
  notes: string | null;
  refId: string;
  flag?: string | null;
}

// Shared fields between entity and form
interface PatientBase {
  firstName: string;
  lastName: string;
  county: string;
  status: string;
}

// Patient entity interface
export interface Patient extends PatientBase {
  id: string;
  name?: string;
  dob: string;
  gender?: string;
  assignedRegion?: string;
  assignedRegionId?: string;
  countyName?: string;
  avatar?: string;
  avatarColor?: ThemeColor;

  // Nurse assignment (optional — both nullable on backend)
  primaryNurseProfileId?: string | null;
  secondaryNurseProfileId?: string | null;
  primaryNurse?: PatientStaffRef | null;
  secondaryNurse?: PatientStaffRef | null;
  primaryNurseName?: string;
  secondaryNurseName?: string;

  // Case manager and every assigned caregiver (direct link or assessment).
  caseManager?: PatientStaffRef | null;
  assignedCaregivers?: PatientStaffRef[];
  caseManagerName?: string;
  assignedCaregiverNames?: string[];

  // Every coordinator HHAeXchange lists; only one is the case manager here.
  hhaCoordinators?: HhaPatientCoordinator[];

  // Optional fields
  phoneNo?: string;
  email?: string;
  streetAddress?: string;
  city?: string;
  zipCode?: string;
  emergencyContact?: string;
  medicaidId?: string;
  diagnoses?: string;
  notes?: string;

  // Caregiver view fields
  nextChecklistDate?: string;
  checked?: boolean;

  // Provenance. `source` is the raw backend PatientSource enum value
  // ('MANUAL' | 'HHA_EXCHANGE'); the frontend maps it to a label and colour.
  source?: string;
  hhaPatientId?: string | null;
  hhaLastSyncedAt?: string | null;

  // True while HHAeXchange's ZIP resolves to the county; it is read-only then.
  isCountyHhaManaged?: boolean;

  // True while HHAeXchange names the primary nurse; an admin picks it otherwise.
  isPrimaryNurseHhaManaged?: boolean;

  // True while the sync set the case manager; false once an admin picked one.
  isCaseManagerHhaManaged?: boolean;

  // Who HHAeXchange names but cannot be linked yet: not invited, or not active.
  hhaPendingNurse?: PatientStaffRef | null;
  hhaPendingCaseManager?: PatientStaffRef | null;

  // Soft-delete (archive) state
  deletedAt?: string | null;
  archived?: boolean;

  // Display fields (table)
  diagnosis: string;

  // Newest non-voided RED or YELLOW flag, null when there is none.
  lastFlag: string | null;
}

export interface PatientsTableProps extends TableTitleProps {
  isReadOnly?: boolean;
  addButtonText?: string;

  // Which reading of the table to render. Defaults to the admin one.
  variant?: PatientViewVariant;
}

// What each patient owes the signed-in caregiver today, keyed by patient id.
// Only the caregiver variant of the table reads it.
export type PatientWorkloadMap = Record<string, CaregiverPatientWorkload>;

/**
 * One of the caregiver's patients as a picker, filter or list row reads it.
 * `name` is "Last, First"; `identityLine` is age and sex.
 */
export interface CaregiverPatientOption {
  id: string;
  name: string;
  firstName: string;
  identityLine: string;
}

export interface PatientsTableUIProps extends ToolbarTableUIProps {
  patients: Patient[];
  variant?: PatientViewVariant;
  workload?: PatientWorkloadMap;
  workloadStatus?: CaregiverWorkloadStatus;
  onRetryWorkload?: () => void;
  onAddPatient?: () => void;
  onEditPatient?: RowAction;

  /** Opens the edit drawer straight on its care team step. */
  onEditCareTeam?: RowAction;
  onDeletePatient?: RowAction;

  /** Row whose full record is loading for the edit drawer. */
  editLoadingId?: string | null;

  /** The drawer step that row is loading for, so the right button spins. */
  editLoadingStep?: PatientDrawerStep;
  showAddButton?: boolean;
  readOnly?: boolean;
  addButtonText?: string;
  actionSlot?: ReactNode;
}

export interface PatientTableRowActionsProps extends RowActionsProps {
  showEdit?: boolean;
  showDelete?: boolean;

  /** The full record is loading so the edit drawer can open. */
  isEditLoading?: boolean;

  /** Opens the edit drawer on its care team step. Hidden with Edit. */
  onCareTeam?: RowAction;

  /** The full record is loading so the drawer can open on the care team. */
  isCareTeamLoading?: boolean;
}

export interface CountyOption {
  label: string;
  value: string;
  regionName: string;
  regionId: string;
}

export interface PatientAssignmentRecord {
  id: string;
  checklistTemplateId: string;
  checklistTemplate?: {title?: string} | null;
  caregiverProfileId: string;
  caregiverProfile?: {
    user?: {firstName?: string; lastName?: string};
  } | null;
  type?: string;
  startDate?: string;
  endDate?: string;
  notes?: string | null;
}

export interface PatientDrawerProps extends BaseModalProps {
  patient?: Patient | null;
  initialStep?: PatientDrawerStep;
  onSaved?: () => void;
}

export interface ArchivePatientDialogProps {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
  onArchived: () => void;
}

export interface PatientDrawerStepperProps {
  activeStep: PatientDrawerStep;
  canOpenCareTeam: boolean;
  onStepChange: ({step}: {step: PatientDrawerStep}) => void;
}

export interface PatientDetailsStepProps {
  onSubmit: (e: React.FormEvent) => void;
  control: Control<PatientFormPayload>;
  countySource: AsyncSelectSource<CountyOption>;

  // True when the patient came from HHAeXchange. Disables the fields that
  // service owns; the backend rejects them anyway, this just shows it first.
  isHhaManaged: boolean;

  // True while HHAeXchange's ZIP resolves to the county, which locks it.
  isCountyHhaManaged: boolean;
}

export interface PatientCareTeamCellProps {
  patient: Patient;
}

export interface PatientLocationSectionProps {
  control: Control<PatientFormPayload>;
  countySource: AsyncSelectSource<CountyOption>;
  isHhaManaged: boolean;
  isCountyHhaManaged: boolean;
}

export interface PatientNurseFieldsProps {
  control: Control<PatientFormPayload>;
  primaryNurseSource: AsyncSelectSource;
  secondaryNurseSource: AsyncSelectSource;
  isLoading: boolean;
  isHhaManaged: boolean;

  // Decides whether the primary nurse is locked, and who it waits for.
  patient: Patient | null;
  countyName: string;
}

export interface PatientCaseManagerFieldProps {
  control: Control<PatientFormPayload>;
  caseManagerSource: AsyncSelectSource;
  isLoading: boolean;
  patient: Patient | null;
}

export interface PatientCareTeamStepProps {
  onSubmit: (e: React.FormEvent) => void;
  patientControl: Control<PatientFormPayload>;
  assignmentsControl: Control<PatientAssignmentsFormPayload>;
  primaryNurseSource: AsyncSelectSource;
  secondaryNurseSource: AsyncSelectSource;

  // HHA patients only: the case manager picker, used while it is editable.
  caseManagerSource: AsyncSelectSource;

  // The primary nurse and case manager are read-only while HHAeXchange's hold.
  isHhaManaged: boolean;
  patient: Patient | null;
  countyName: string;
  newAssignments: FieldArrayWithId<
    PatientAssignmentsFormPayload,
    'assignments',
    'id'
  >[];
  existingAssignments: PatientAssignmentRecord[];
  removedAssignmentIds: string[];

  collapsedAssignmentIds: string[];
  isFetchingAssignments: boolean;
  isAssignable: boolean;
  isLoading: boolean;
  checklistTemplateOptions: SelectOption[];
  onAddAssignment: () => void;
  onDiscardAssignment: ({index}: {index: number}) => void;
  onCollapseAssignment: ({index}: {index: number}) => void;
  onExpandAssignment: ({index}: {index: number}) => void;
  onRemoveExistingAssignment: ({id}: {id: string}) => void;
  onUndoRemoveAssignment: ({id}: {id: string}) => void;
}

export interface PatientDrawerUIProps
  extends BaseModalProps, PatientDrawerStepperProps {
  title: string;
  subtitle: string;
  isLoading: boolean;
  isDirty: boolean;
  onBack: () => void;
  detailsStep: PatientDetailsStepProps;
  careTeamStep: PatientCareTeamStepProps;
}

export interface AssignmentRowProps {
  title: string;
  caregiverName: string;
  frequency?: string;
  startDate: unknown;
  endDate: unknown;
  isNew?: boolean;
  isRemoved?: boolean;
  isDisabled: boolean;
  isSaving?: boolean;
  onEdit?: () => void;
  onRemove: () => void;
  onUndo?: () => void;
}

export interface NewAssignmentCardProps {
  index: number;
  control: Control<PatientAssignmentsFormPayload>;
  isDisabled: boolean;
  onCollapse: ({index}: {index: number}) => void;
  onDiscard: ({index}: {index: number}) => void;
  checklistTemplateOptions: SelectOption[];
}

export interface PatientAssessmentOptions {
  checklistTemplateOptions: SelectOption[];
}

export interface UsePatientDetailsFormParams {
  isOpen: boolean;
  patient: Patient | null;
  countySource: AsyncSelectSource<CountyOption>;
}

export interface UsePatientAssignmentsDraftParams {
  isOpen: boolean;
  patientId: string;

  startWithNewAssignment?: boolean;
}

// What the patients table needs to build its columns: the row actions it may
// offer and the translator for the headers.
export interface GetPatientColumnsOptions {
  onEdit?: RowActionsProps['onEdit'];
  onDelete?: RowActionsProps['onDelete'];
  onCareTeam?: RowAction;
  editLoadingId?: string | null;
  editLoadingStep?: PatientDrawerStep;
  showEdit?: boolean;
  showDelete?: boolean;
  showActions?: boolean;
  variant?: PatientViewVariant;
  workload?: PatientWorkloadMap;
  workloadStatus?: CaregiverWorkloadStatus;
  onRetryWorkload?: () => void;
  t: (key: string) => string;
}
