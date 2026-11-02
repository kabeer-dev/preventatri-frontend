import {FormEvent} from 'react';

import {Control, UseFormSetValue} from 'react-hook-form';

import {ThemeColor} from '@/@core/theme/types';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {UserRef} from '@/shared/interfaces/common';
import {SelectOption} from '@/shared/interfaces/inputs';
import {FormModalProps} from '@/shared/interfaces/modals';
import {
  EntityTableProps,
  SearchableTableUIProps,
} from '@/shared/interfaces/tables';
import {
  CaseManagerFormPayload,
  CaseManagerFormValues,
} from '@/shared/types/caseManager';
import {ResendInvitationAction, RowAction} from '@/shared/types/tables';

// Dashboard for the logged-in case manager from GET /case-managers/dashboard
export interface CaseManagerDashboardStats {
  tasksAssignedToMe: {
    total: number;
    followUps: number;
    supervisoryVisits: number;
  };
  myPatients: number;

  // Null when no escalation assigned to them ended in the window.
  assessmentRate: number | null;
  assessmentRateCounts: {
    resolved: number;
    skipped: number;
  };
}

export type CaseManagerDashboardStatKey =
  'tasksAssignedToMe' | 'myPatients' | 'assessmentRate';

export type CaseManagerChecklistTaskType = 'FOLLOW_UP' | 'SUPERVISORY_VISIT';

export interface CaseManagerChecklistTask {
  id: string;
  type: CaseManagerChecklistTaskType;
  dueDate: string;
  flagType: number | null;
  checklistTitle: string | null;
  patientName: string;
}

export interface CaseManagerDashboardResponse {
  stats: CaseManagerDashboardStats;
  checklistTasks: CaseManagerChecklistTask[];
}

export interface CaseManagerChecklistTasksCardProps {
  items: CaseManagerChecklistTask[];
  isLoading: boolean;
  isError: boolean;
}

export interface CaseManagerChecklistTaskRowProps {
  item: CaseManagerChecklistTask;
}

// Shared fields between entity and form
interface CaseManagerBase {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  regionIds: string[];
  status: string;
}

// Case Manager listing-page stats from GET /case-managers/admin/stats
export interface CaseManagerStats {
  totalCaseManagers: number;
  activeCaseManagers: number;
  averageCasesPerCaseManager: number;
}

// A patient currently on a case manager's roster
export interface CaseManagerAssignedPatient {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  avatarColor?: ThemeColor;
  flagStatus: 'red' | 'yellow' | 'green';

  // The patient's source; HHA patients' links come from the sync, read-only.
  source?: string;
}

// Case Manager entity interface
export interface CaseManager extends CaseManagerBase {
  id: string;

  /** Set by the API when the case manager is archived; the page is then read-only. */
  archived?: boolean;
  name?: string;
  avatar?: string;
  avatarColor?: ThemeColor;

  // Whether the invited user has accepted the invitation
  isVerified?: boolean;

  // Optional fields
  preferredContactMethod?: string;
  language?: string;
  startDate?: string | null;
  title?: string;
  notes?: string;

  // Region assignments
  regionNames?: string[];
  regions?: {id: string; name: string}[];

  // Patient assignments. patientIds holds the MANUAL roster the form edits;
  // hhaPatients are linked by the HHAeXchange sync and shown read-only.
  patientIds?: string[];
  patients?: CaseManagerAssignedPatient[];
  hhaPatients?: CaseManagerAssignedPatient[];

  // HHAeXchange provenance. `source` drives the read-only treatment of the
  // managed fields; the sync overwrites them nightly, so an edit would vanish.
  //
  // There is no hhaModifiedDate counterpart to the caregiver interface:
  // GetCoordinators publishes no ModifiedDate, so hhaLastSyncedAt is the only
  // timestamp available for a case manager.
  source?: string;
  hhaCoordinatorId?: string;
  hhaLastSyncedAt?: string;

  // True while the email is still the synthetic @hhax.invalid address the sync
  // minted because HHAeXchange had none. The only state in which an HHA-managed
  // case manager's email may be edited.
  isPlaceholderEmail?: boolean;

  // Display fields (table)
  assignedPatients?: number;
  lastLogin?: string;
}

// CaseManagersTableUI component props
export interface CaseManagersTableUIProps
  extends SearchableTableUIProps, EntityTableProps {
  caseManagers: CaseManager[];
  onAddCaseManager?: () => void;
  onEditCaseManager?: RowAction;
  onDeleteCaseManager?: RowAction;
  onResendInvitation?: ResendInvitationAction;
}

// UnassignPatientsDialog component props
export interface UnassignPatientsDialogProps {
  isOpen: boolean;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

// CaseManagerModal component props
export interface CaseManagerModalProps extends FormModalProps<CaseManagerFormValues> {
  caseManager?: CaseManager | null;
}

// A case manager from GET /case-managers, as a picker needs it.
export interface CaseManagerOptionRow {
  profileId: string;
  user?: UserRef;
}

export interface UseCaseManagerSelectOptionsParams {
  enabled?: boolean;
  seedOptions?: SelectOption[];
}

// A label/value pair for the form's dropdowns.
export interface CaseManagerSelectOption {
  readonly label: string;
  readonly value: string;
}

/**
 * Props shared by every section of the case manager form.
 *
 * The form is split into sections so no file exceeds the 200-line cap, and each
 * of them needs the react-hook-form control plus whether this record is
 * HHAeXchange-managed.
 *
 * `isHhaManaged` rather than a plain `disabled`, unlike the caregiver form:
 * HHAeXchange owns only SOME of a case manager's fields, so each section
 * decides per field rather than greying itself out wholesale. title, phoneNo,
 * regions, patients, preferred contact, language, start date and notes stay
 * editable on an imported case manager -- that is what makes the admin review
 * possible.
 */
export interface CaseManagerFormSectionProps {
  control: Control<CaseManagerFormPayload, unknown, CaseManagerFormValues>;
  isHhaManaged?: boolean;
}

export interface CaseManagerPersonalFieldsProps extends CaseManagerFormSectionProps {
  isEditMode?: boolean;

  // True while an HHA-managed case manager still carries the generated
  // placeholder email — the one case in which their email may be edited.
  canEditEmail?: boolean;
}

export interface CaseManagerAssignmentFieldsProps extends CaseManagerFormSectionProps {
  regionSource: AsyncSelectSource;
  patientOptions: CaseManagerSelectOption[];
  hasRegionsSelected: boolean;
  statusOptions: readonly CaseManagerSelectOption[];
  hhaPatients: CaseManagerAssignedPatient[];
}

// Nothing in this section is HHAeXchange-managed (title is PreventaTri-owned),
// so unlike the other sections it only needs the form control.
export interface CaseManagerProfessionalFieldsProps {
  control: Control<CaseManagerFormPayload, unknown, CaseManagerFormValues>;
  contactMethodOptions: readonly CaseManagerSelectOption[];
  languageOptions: readonly CaseManagerSelectOption[];
}

// Inputs of useCaseManagerPatientOptions. The watched form values come in as
// plain arrays so the hook stays free of react-hook-form's Control generics.
export interface UseCaseManagerPatientOptionsParams {
  isOpen: boolean;
  isEditMode: boolean;
  caseManager?: CaseManager | null;
  assignedRegions?: string[];
  currentPatientIds?: string[];
  setValue: UseFormSetValue<CaseManagerFormPayload>;
}

// CaseManagerModalUI component props
export interface CaseManagerModalUIProps
  extends CaseManagerAssignmentFieldsProps, CaseManagerProfessionalFieldsProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  isLoading?: boolean;
  isEditMode?: boolean;
  isDirty?: boolean;

  // True only while an imported case manager still carries the synthetic
  // placeholder address. The single state in which email may be edited.
  canEditEmail?: boolean;
}
