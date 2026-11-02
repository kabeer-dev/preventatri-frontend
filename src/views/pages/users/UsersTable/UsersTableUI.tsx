'use client';

import Button from '@mui/material/Button';

import DataTable from '@/shared/components/common/table/DataTable';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import useTranslation from '@/shared/hooks/useTranslation';
import {OrgUser, OrgUsersTableUIProps} from '@/shared/interfaces/orgUser';

import {getOrgUserColumns} from './columns';

/** Presentational shell for the unified Users & Roles roster. */
const UsersTableUI = ({
  users,
  isLoading = false,
  toolbar,
  paginationProps,
  actionSlot,
  onRowClick,
  onInviteUser,
  onEditUser,
  onDeleteUser,
  onResendInvitation,
  onCancelInvitation,
  selection,
  onBulkInvite,
}: OrgUsersTableUIProps) => {
  const {t} = useTranslation();

  const columns = getOrgUserColumns({
    t,
    onEdit: onEditUser,
    onDelete: onDeleteUser,
    onResendInvitation,
    onCancelInvitation,
  });

  const selectedCount = selection.selectedIds.length;

  return (
    <>
      <TopBarSlot side='right'>
        {actionSlot}

        {selectedCount > 0 && (
          <Button variant='outlined' onClick={onBulkInvite}>
            {t('orgUsers.bulkInvite.button', {count: selectedCount})}
          </Button>
        )}

        <Button variant='contained' onClick={onInviteUser}>
          {t('orgUsers.table.inviteButton')}
        </Button>
      </TopBarSlot>

      <DataTable<OrgUser>
        rows={users}
        columns={columns}
        loading={isLoading}
        noRowsLabel={t('orgUsers.table.noRowsLabel')}
        serverSidePagination={paginationProps}
        toolbar={toolbar}
        selection={selection}
        onRowClick={(params) => onRowClick({user: params.row})}
      />
    </>
  );
};

export default UsersTableUI;
