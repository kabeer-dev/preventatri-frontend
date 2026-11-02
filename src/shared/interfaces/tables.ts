import {ReactNode} from 'react';

import {ServerSideTablePaginationProps} from '@/shared/interfaces/hooks';
import {ListToolbarProps} from '@/shared/interfaces/listToolbar';
import {RowAction} from '@/shared/types/tables';

export interface CellType<TRow> {
  row: TRow;
}

export interface RowActionsProps {
  id: string;
  onEdit?: RowAction;
  onDelete?: RowAction;
}

export interface DataTableRowActionsProps extends RowActionsProps {
  onVoid?: RowAction;
  onSkip?: RowAction;
  onResendInvitation?: () => void;
  onCancelInvitation?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showVoid?: boolean;
  showSkip?: boolean;
  skipLabel?: string;
  showResendInvitation?: boolean;
  showCancelInvitation?: boolean;

  /** Tooltip of the invitation icon: "Send" on a first invite, else "Resend". */
  resendInvitationLabel?: string;
  cancelInvitationLabel?: string;
}

export interface TableTitleProps {
  title?: string;
}

export interface EntityTableProps extends TableTitleProps {
  showAddButton?: boolean;
  addButtonText?: string;
  actionSlot?: ReactNode;
}

export interface TableUIProps extends TableTitleProps {
  isLoading?: boolean;
  paginationProps?: ServerSideTablePaginationProps;
}

export interface SearchableTableUIProps extends TableUIProps {
  searchValue?: string;
  onSearchChange?: ({val}: {val: string}) => void;
}

export interface ToolbarTableUIProps extends TableUIProps {
  toolbar?: ListToolbarProps;
}
