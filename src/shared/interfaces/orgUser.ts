import {ReactNode} from 'react';

import {ServerSideTablePaginationProps} from '@/shared/interfaces/hooks';
import {ListToolbarProps} from '@/shared/interfaces/listToolbar';
import {DataTableSelection} from '@/shared/interfaces/uiComponents';
import {
  CancelInvitationAction,
  ResendInvitationAction,
  RowAction,
} from '@/shared/types/tables';

/**
 * One row of the unified Users & Roles roster.
 *
 * The backend returns raw enum values only -- every label, colour and icon is
 * resolved on this side.
 */
export interface OrgUser {
  id: string; // UserOrganization id -- the row's own identity.
  userId: string | null;
  profileId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNo: string | null;
  role: string;
  status: string;

  /** MANUAL or HHA_EXCHANGE -- where the profile came from. */
  source: string | null;
  isVerified: boolean;

  /** Archived people are read-only: no edit, archive or invitation actions. */
  archived: boolean;

  /** An ORG_USER_INVITATION_STATUS value, derived by the backend. */
  invitationStatus: string;
  invitationSentAt: string | null;
  createdAt: string | null;
}

export interface OrgUserRowActionHandlers {
  onEdit?: RowAction;
  onDelete?: RowAction;
  onResendInvitation?: ResendInvitationAction;
  onCancelInvitation?: CancelInvitationAction;
}

export interface OrgUserRowActionsProps extends OrgUserRowActionHandlers {
  row: OrgUser;
}

/** One person's outcome in a bulk invitation. */
export interface BulkInvitationResult {
  userId: string;
  sent: boolean;

  /** Why the person was skipped; keys `orgUsers.bulkInvite.reasons.*`. */
  reason: string | null;
}

export interface BulkInvitationSummary {
  results: BulkInvitationResult[];
  sentCount: number;
  skippedCount: number;
}

export interface BulkInviteDialogsProps {
  selectedCount: number;
  isConfirmOpen: boolean;
  isSending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  summary: BulkInvitationSummary | null;

  /** The rows that were sent, to name the people who were skipped. */
  invitedUsers: OrgUser[];
  onCloseSummary: () => void;
}

/** Per-role totals for the tabs. Independent of the active role filter. */
export type OrgUserTabCounts = Record<string, number>;

export interface OrgUsersTableUIProps {
  users: OrgUser[];
  isLoading?: boolean;
  toolbar: ListToolbarProps;
  paginationProps?: ServerSideTablePaginationProps;
  actionSlot?: ReactNode;
  onRowClick: ({user}: {user: OrgUser}) => void;
  onInviteUser: () => void;
  onEditUser: ({id}: {id: string}) => void;
  onDeleteUser: ({id}: {id: string}) => void;
  onResendInvitation: ResendInvitationAction;
  onCancelInvitation: CancelInvitationAction;
  selection: DataTableSelection<OrgUser>;
  onBulkInvite: () => void;
}

export interface OrgUserRoleTabsParams {
  role: string | null;
  tabCounts: OrgUserTabCounts;
  onChange: ({role}: {role: string | null}) => void;
}

export interface InviteRoleSelectorProps {
  role: string;
  onChange: ({role}: {role: string}) => void;
  disabled?: boolean;
}

export interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;

  /** Role the modal opens on, e.g. the active roster tab. */
  initialRole?: string | null;
}

/** What the edit and delete flows need, whether from a roster row or a details page. */
export type OrgUserRecord = Pick<
  OrgUser,
  'role' | 'profileId' | 'firstName' | 'lastName'
>;

export interface EditUserModalProps {
  user: OrgUserRecord;
  onClose: () => void;
}

export interface DeleteUserDialogProps {
  user: OrgUserRecord;
  onClose: () => void;
  onDeleted?: () => void;
}

export interface UserRecordActionsProps {
  user: OrgUserRecord;
}

/** The organization a person joined by accepting an emailed invitation. */
export interface AcceptedOrganizationInvitation {
  organizationId: string;
  organizationName: string;
}

export interface AcceptOrganizationInvitationProps {
  token: string;
}

export interface AcceptOrganizationInvitationUIProps {
  organizationName?: string;
  isLoading: boolean;
  isSwitching: boolean;
  errorMessage: string;
  onGoToDashboard: () => void;
}

export interface SwitchOrganizationProps {
  organizationId: string;
}
