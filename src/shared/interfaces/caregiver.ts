import {FormEvent} from 'react';

import {Control} from 'react-hook-form';

import {ThemeColor} from '@/@core/theme/types';
import {FormModalProps} from '@/shared/interfaces/modals';
import {
  EntityTableProps,
  SearchableTableUIProps,
} from '@/shared/interfaces/tables';
import {
  CaregiverFormPayload,
  CaregiverFormValues,
} from '@/shared/types/caregiver';
import {ResendInvitationAction, RowAction} from '@/shared/types/tables';

/**
 * Caregiver listing-page stats from GET /caregivers/admin/stats.
 *
 * One count per CaregiverStatus plus the total. The four beyond
 * active/inactive arrived with the HHAeXchange import, which can set any of the
 * six statuses; they are optional so an older API response still types.
 */
export interface CaregiverStats {
  totalCaregivers: number;
  activeCaregivers: number;
  inactiveCaregivers: number;
  holdCaregivers?: number;
  onLeaveCaregivers?: number;
  terminatedCaregivers?: number;
  rejectedCaregivers?: number;
}

// Self-service dashboard stats for the logged-in caregiver from GET /caregivers/stats
export interface CaregiverDashboardStats {
  assignedPatients: number;
  assessmentsDue: number;
  assessmentsCompleted: number;
  submittedFlags: number;
  followUpTasks: number;
}

export interface CaregiverDashboardStatsResponse {
  stats: CaregiverDashboardStats;
}

// A single option in one of the caregiver form's select fields
export interface SelectOption {
  readonly label: string;
  readonly value: string;
}

// Shared fields between entity and form
interface CaregiverBase {
  firstName: string;
  lastName: string;
  email: string;
  caregiverRole: string;
  status: string;
}

// Caregiver entity interface
export interface Caregiver extends CaregiverBase {
  id: string;

  /** Set by the API when the caregiver is archived; the page is then read-only. */
  archived?: boolean;
  name?: string;
  phoneNo?: string;
  avatar?: string;
  avatarColor?: ThemeColor;

  // Whether the invited user has accepted the invitation
  isVerified?: boolean;

  // Optional fields
  preferredContactMethod?: string;
  relationshipToPatient?: string;
  language?: string;
  notes?: string;
  startDate?: string;
  terminationDate?: string;
  onCallIndicator?: boolean;

  // Address. Stored on the user record — a CaregiverProfile is a User
  // satellite — but presented and edited as a caregiver field.
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  // HHAeXchange provenance. `source` drives the read-only treatment of the
  // managed fields; the sync overwrites them nightly, so an edit would vanish.
  source?: string;
  hhaCaregiverId?: string;
  hhaLastSyncedAt?: string;
  hhaModifiedDate?: string;

  // True while the email is still the synthetic @hhax.invalid address the sync
  // minted because HHAeXchange had none. The only state in which an HHA-managed
  // caregiver's email may be edited.
  isPlaceholderEmail?: boolean;

  // Display fields (table)
  assignedPatients?: number;
  redFlags?: number;
  lastActive?: string;
}

// CaregiversTableUI component props
export interface CaregiversTableUIProps
  extends SearchableTableUIProps, EntityTableProps {
  caregivers: Caregiver[];
  onAddCaregiver?: () => void;
  onEditCaregiver?: RowAction;
  onDeleteCaregiver?: RowAction;
  onResendInvitation?: ResendInvitationAction;
}

/**
 * Shared props for every section of the caregiver form.
 *
 * The form is split into section components to keep each file under the
 * 200-line component cap; they all take the same control plus the HHAeXchange
 * read-only flag, so the shape is declared once here.
 */
export interface CaregiverFormSectionProps {
  control: Control<CaregiverFormPayload, unknown, CaregiverFormValues>;

  // True for a caregiver imported from HHAeXchange: the fields that service
  // owns are disabled, because the nightly sync overwrites them.
  disabled?: boolean;
}

export interface CaregiverPersonalFieldsProps extends CaregiverFormSectionProps {
  isEditMode?: boolean;

  // True while an HHA-managed caregiver still carries the generated placeholder
  // email — the one case in which their email may be edited.
  canEditEmail?: boolean;
}

export interface CaregiverRoleStatusFieldsProps extends CaregiverFormSectionProps {
  roleOptions: readonly SelectOption[];
  statusOptions: readonly SelectOption[];
  relationshipOptions: readonly SelectOption[];
}

export interface CaregiverAdditionalFieldsProps extends CaregiverFormSectionProps {
  contactMethodOptions: readonly SelectOption[];
  languageOptions: readonly SelectOption[];
}

export interface CaregiverModalUIProps
  extends CaregiverRoleStatusFieldsProps, CaregiverAdditionalFieldsProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  isLoading?: boolean;
  isEditMode?: boolean;
  isDirty?: boolean;
  isHhaManaged?: boolean;
  canEditEmail?: boolean;
}

// CaregiverModal component props
export interface CaregiverModalProps extends FormModalProps<CaregiverFormValues> {
  caregiver?: Caregiver | null;
}

export interface CaregiverSearchSource {
  profileId: string;
  user?: {firstName?: string; lastName?: string};
}
