import {ServerSideTablePaginationProps} from '@/shared/interfaces/hooks';
import {ListToolbarProps} from '@/shared/interfaces/listToolbar';
import {
  OrganizationAction,
  OrganizationStatus,
} from '@/shared/types/superAdmin';

export interface ManagedOrganizationCreator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/** One organization row of the super admin's list. */
export interface ManagedOrganization {
  id: string;
  organizationName: string;
  status: OrganizationStatus;
  statusReason: string | null;
  statusChangedAt: string | null;
  createdAt: string;
  creator: ManagedOrganizationCreator | null;
}

export interface ManagedOrganizationsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface OrganizationActionEndpointParams {
  id: string;
  action: OrganizationAction;
}

export interface OrganizationActionRequest {
  organization: ManagedOrganization;
  action: OrganizationAction;
}

export interface OrganizationActionHandlers {
  onAction: ({organization, action}: OrganizationActionRequest) => void;
}

export interface OrganizationsTableUIProps extends OrganizationActionHandlers {
  organizations: ManagedOrganization[];
  isLoading: boolean;
  toolbar: ListToolbarProps;
  paginationProps: ServerSideTablePaginationProps;
}

export interface OrganizationRowActionsProps extends OrganizationActionHandlers {
  row: ManagedOrganization;
}

export interface OrganizationActionDialogProps {
  request: OrganizationActionRequest | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: ({reason}: {reason?: string}) => void;
}
