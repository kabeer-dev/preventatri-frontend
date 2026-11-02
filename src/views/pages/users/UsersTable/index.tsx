'use client';

import {useState} from 'react';

import {useRouter} from 'next/navigation';
import {parseAsString, useQueryState} from 'nuqs';

import HhaSyncAction from '@/shared/components/common/HhaSyncAction';
import {LIST_TYPES} from '@/shared/constants/general';
import {DETAIL_ROUTE_BY_TYPE} from '@/shared/constants/globalSearch';
import {ORG_USER_FILTER_PARAMS} from '@/shared/constants/orgUsers';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useBulkInvitationFlow} from '@/shared/hooks/useBulkInvitationFlow';
import {useCancelInvitationFlow} from '@/shared/hooks/useCancelInvitationFlow';
import {useOrgUserListFilters} from '@/shared/hooks/useOrgUserListFilters';
import {useOrgUserRoleTabs} from '@/shared/hooks/useOrgUserRoleTabs';
import {useResendInvitationFlow} from '@/shared/hooks/useResendInvitationFlow';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {OrgUser} from '@/shared/interfaces/orgUser';
import {userQueries} from '@/shared/reactQuery';
import {SearchResultType} from '@/shared/types/search';
import BulkInviteDialogs from '@/views/pages/users/BulkInviteDialogs';
import DeleteUserDialog from '@/views/pages/users/DeleteUserDialog';
import EditUserModal from '@/views/pages/users/EditUserModal';
import InviteUserModal from '@/views/pages/users/InviteUserModal';

import UsersTableUI from './UsersTableUI';

/**
 * Smart component for the unified Users & Roles roster.
 *
 * Every filter is applied server-side: the tabs, the pager and the counts all
 * have to agree across roles, which cannot be done by filtering a page in JS.
 */
const UsersTable = () => {
  const {t} = useTranslation();
  const router = useRouter();
  const {isAdmin} = useUserRole();

  // Kept in the URL so a filtered roster is shareable, survives a refresh, and
  // can be deep-linked into one role.
  const [role, setRole] = useQueryState(
    ORG_USER_FILTER_PARAMS.role,
    parseAsString
  );

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<OrgUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<OrgUser | null>(null);

  const {handleResendInvitation, resendInvitationModal} =
    useResendInvitationFlow();

  const {handleCancelInvitation, cancelInvitationModal} =
    useCancelInvitationFlow();

  const {useFetchOrgUsersList} = userQueries();
  const {filterParams, toolbarFilters} = useOrgUserListFilters();

  const {
    filteredData: users,
    responseData,
    isLoading,
    reactQueryData,
    tablePaginationProps,
    filters: {search},
    setFilters: setListFilters,
  } = useServerSideListFilters<OrgUser>({
    listType: LIST_TYPES.users,
    queryToCall: useFetchOrgUsersList,
    dataKey: LIST_TYPES.users.value,
    baseParams: {role, ...filterParams},
  });

  const tabs = useOrgUserRoleTabs({
    role,
    tabCounts: responseData?.tabCounts ?? {},
    onChange: ({role: nextRole}) => setRole(nextRole),
  });

  const handleRowClick = ({user}: {user: OrgUser}) => {
    const buildRoute = DETAIL_ROUTE_BY_TYPE[user.role as SearchResultType];

    if (!buildRoute || !user.profileId) return;

    router.push(buildRoute({id: user.profileId}));
  };

  const handleInviteUser = () => setIsInviteOpen(true);

  // Row actions carry the UserOrganization id; the modals need the row itself,
  // which holds the profileId their endpoints are keyed on.
  const findUser = ({id}: {id: string}) =>
    users.find((row) => row.id === id) ?? null;

  const handleEditUser = ({id}: {id: string}) => setUserToEdit(findUser({id}));

  const handleDeleteUser = ({id}: {id: string}) =>
    setUserToDelete(findUser({id}));

  const bulkInvite = useBulkInvitationFlow({users});

  return (
    <>
      <UsersTableUI
        users={users}
        isLoading={isLoading || reactQueryData.isFetching}
        toolbar={{
          tabs,
          search: {
            value: search,
            onChange: ({val}) => setListFilters({search: val}),
            placeholder: t('orgUsers.table.searchPlaceholder'),
          },
          filters: toolbarFilters,
        }}
        paginationProps={tablePaginationProps}
        actionSlot={isAdmin ? <HhaSyncAction /> : undefined}
        onRowClick={handleRowClick}
        onInviteUser={handleInviteUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onResendInvitation={handleResendInvitation}
        onCancelInvitation={handleCancelInvitation}
        selection={bulkInvite.selection}
        onBulkInvite={bulkInvite.openBulkInvite}
      />

      <BulkInviteDialogs
        selectedCount={bulkInvite.selectedCount}
        isConfirmOpen={bulkInvite.isConfirmOpen}
        isSending={bulkInvite.isSending}
        onCancel={bulkInvite.closeBulkInvite}
        onConfirm={bulkInvite.confirmBulkInvite}
        summary={bulkInvite.summary}
        invitedUsers={bulkInvite.invitedUsers}
        onCloseSummary={bulkInvite.clearSummary}
      />

      <InviteUserModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        initialRole={role}
      />

      {userToEdit && (
        <EditUserModal user={userToEdit} onClose={() => setUserToEdit(null)} />
      )}

      {userToDelete && (
        <DeleteUserDialog
          user={userToDelete}
          onClose={() => setUserToDelete(null)}
        />
      )}

      {resendInvitationModal}
      {cancelInvitationModal}
    </>
  );
};

export default UsersTable;
