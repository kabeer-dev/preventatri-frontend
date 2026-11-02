import {Control} from 'react-hook-form';

import {ThemeColor} from '@/@core/theme/types';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {UserRef} from '@/shared/interfaces/common';
import {FormModalProps} from '@/shared/interfaces/modals';
import {
  EntityTableProps,
  SearchableTableUIProps,
} from '@/shared/interfaces/tables';
import {
  NurseDashboardItemType,
  NurseFormPayload,
  NurseFormValues,
} from '@/shared/types/nurse';
import {ResendInvitationAction, RowAction} from '@/shared/types/tables';

// Nurse listing-page stats from GET /nurses/admin/stats
export interface NurseStats {
  totalNurses: number;
  averageAlertsPerNurse: number;
  availableNurses: number;
}

// GET /nurses/dashboard. dueToday and myDay are the nurse's open follow-up
// tasks due today.
export interface NurseDashboardOpenAlerts {
  total: number;
  red: number;
  yellow: number;
}

export interface NurseDashboardDueToday {
  total: number;
  followUps: number;
  supervisoryVisits: number;
}

export interface NurseDashboardStats {
  openAlerts: NurseDashboardOpenAlerts;
  dueToday: NurseDashboardDueToday;
  myPatients: number;
}

export interface NurseDashboardMyDayItem {
  id: string;
  type: NurseDashboardItemType;
  title: string;
  patientName: string;
  dueDate: string;
  dueTime: string;
  priority?: string;
  status?: string;
}

export interface NurseAssessmentsSinceYesterday {
  submitted: number;
  missed: number;
  skipped: number;
}

export interface NurseDashboardResponse {
  stats: NurseDashboardStats;
  myDay: NurseDashboardMyDayItem[];
  assessmentsSinceYesterday: NurseAssessmentsSinceYesterday;
}

export type NurseDashboardStatKey = 'openAlerts' | 'dueToday' | 'myPatients';

export interface NurseMyDayRowProps {
  item: NurseDashboardMyDayItem;
  href?: string;
}

export interface NurseMyDayCardProps {
  items: NurseDashboardMyDayItem[];
  isLoading: boolean;
  isError: boolean;
}

export interface NurseAssessmentsCardProps {
  counts?: NurseAssessmentsSinceYesterday;
  isLoading: boolean;
}

// Shared fields between entity and form
interface NurseBase {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  professionalRole: string;

  // Nullable on an HHAeXchange-imported nurse the agency has no licence
  // number recorded for; required on a manually invited one.
  licenseNumber: string;
  licenseState: string;
  primaryRegionIds: string[];
  secondaryRegionIds: string[];
  status: string;

  // Address fields live on the USER record -- a NurseProfile is a User
  // satellite -- but are presented and edited as nurse fields.
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface NamedRef {
  id: string;
  name: string;
}

// Nurse entity interface
export interface Nurse extends NurseBase {
  id: string;

  /** Set by the API when the nurse is archived; the page is then read-only. */
  archived?: boolean;

  // Raw region refs from the API, kept for labelling saved picks.
  primaryRegions?: NamedRef[];
  secondaryRegions?: NamedRef[];
  name?: string;
  avatar?: string;
  avatarColor?: ThemeColor;

  // Whether the invited user has accepted the invitation
  isVerified?: boolean;

  // Professional fields. The expiration date is null on an imported nurse
  // until an admin fills it in -- HHAeXchange never publishes one.
  licenseExpirationDate: string | null;
  npi?: string;

  // HHAeXchange provenance. `source` drives the read-only treatment of the
  // managed fields; the sync overwrites them nightly, so an edit would vanish.
  source?: string;
  hhaNurseId?: string;
  hhaLastSyncedAt?: string;
  hhaModifiedDate?: string;

  // True while HHAeXchange's address resolves to a region; primary regions are
  // then read-only.
  isPrimaryRegionHhaManaged?: boolean;

  // True while the email is still the synthetic @hhax.invalid address the sync
  // minted because HHAeXchange had none. The only state in which an HHA-managed
  // nurse's email may be edited.
  isPlaceholderEmail?: boolean;

  // Optional fields
  onCallIndicator?: boolean;
  preferredContactMethod?: string;
  joiningDate?: string;
  notes?: string;

  // Region assignments
  primaryRegionNames?: string[];
  secondaryRegionNames?: string[];

  // Constraint data
  currentPatientCount?: number;

  // Display fields (table) — supplied only by GET /nurses, computed per page
  assignedAlerts?: number;
  highAlerts?: number;

  // Raw seconds; null when the nurse has never resolved an escalation
  avgRespTimeSeconds?: number | null;
}

// NursesTableUI component props
export interface NursesTableUIProps
  extends SearchableTableUIProps, EntityTableProps {
  nurses: Nurse[];
  onAddNurse?: () => void;
  onEditNurse?: RowAction;
  onDeleteNurse?: RowAction;
  onResendInvitation?: ResendInvitationAction;
}

// Nurse table header props
export interface NurseTableHeaderProps {
  value: string;
  onFilterChange: ({val}: {val: string}) => void;
  onAddClick?: () => void;
  showAddButton?: boolean;
  addButtonText?: string;
}

// NurseModal component props
export interface NurseModalProps extends FormModalProps<NurseFormValues> {
  nurse?: Nurse | null;
}

// A nurse from GET /nurses (used by region modal for primary/secondary picker)
export interface EligibleNurse {
  profileId: string;
  user?: UserRef;
}

// Shape of the body returned by GET /nurses for the modal's purposes.
export interface NursesListResponse {
  nurses?: EligibleNurse[];
}

// Common option shape for nurse-select autocompletes
export interface NurseOption {
  value: string;
  label: string;
}

export interface NurseRegionFieldsProps {
  control: Control<NurseFormPayload, unknown, NurseFormValues>;
  primaryRegionSource: AsyncSelectSource;
  secondaryRegionSource: AsyncSelectSource;
  primaryRegionIds: string[];
  secondaryRegionIds: string[];
  isHhaManaged: boolean;
  isPrimaryRegionHhaManaged: boolean;
}

export interface UsePatientNurseOptionsParams {
  selectedRegionId: string;
  isOpen: boolean;
  savedNurseOptions?: NurseOption[];
}

export interface UsePatientNurseOptionsResult {
  primaryNurseSource: AsyncSelectSource;
  secondaryNurseSource: AsyncSelectSource;
}
