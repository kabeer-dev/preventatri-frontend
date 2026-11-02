'use client';

import {useState} from 'react';

import {ORG_USER_INVITABLE_STATUSES} from '@/shared/constants/orgUsers';
import {useModal} from '@/shared/hooks/modals/useModal';
import useTranslation from '@/shared/hooks/useTranslation';
import {BulkInvitationSummary, OrgUser} from '@/shared/interfaces/orgUser';
import {DataTableSelection} from '@/shared/interfaces/uiComponents';
import {userMutations} from '@/shared/reactQuery';
import {showToast} from '@/shared/utils/toasts';

const isInvitable = ({row}: {row: OrgUser}) =>
  !row.archived && ORG_USER_INVITABLE_STATUSES.includes(row.invitationStatus);

/**
 * Row selection and the bulk "send invitations" action for the roster.
 *
 * Selection is by row (membership) id, since that is what the table keys on;
 * the request is by user id.
 */
export const useBulkInvitationFlow = ({users}: {users: OrgUser[]}) => {
  const {t} = useTranslation();
  const {useBulkInvitationMutation} = userMutations();

  const {mutate: sendInvitations, isPending: isSending} =
    useBulkInvitationMutation();

  const {isModalOpen, openModal, closeModal} = useModal();

  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [summary, setSummary] = useState<BulkInvitationSummary | null>(null);
  const [invitedUsers, setInvitedUsers] = useState<OrgUser[]>([]);

  // A pick only counts while its row is on screen and can still be invited, so
  // a page or filter change never leaves hidden people selected.
  const selectedUsers = users.filter(
    (row) => pickedIds.includes(row.id) && isInvitable({row})
  );

  const selection: DataTableSelection<OrgUser> = {
    selectedIds: selectedUsers.map((row) => row.id),
    onChange: ({ids}) => setPickedIds(ids),
    isRowSelectable: isInvitable,
  };

  const confirmBulkInvite = () => {
    const userIds = selectedUsers.flatMap((row) =>
      row.userId ? [row.userId] : []
    );

    if (userIds.length === 0) return;

    sendInvitations({
      payload: {userIds},
      callBackFuncs: {
        onSuccess: ({data}: {data: BulkInvitationSummary}) => {
          setPickedIds([]);
          closeModal();

          // The dialog exists to name who was skipped; with nobody skipped a
          // toast says it all.
          if (data.skippedCount === 0) {
            showToast({
              type: 'success',
              message: t('orgUsers.bulkInvite.allSent', {
                count: data.sentCount,
              }),
            });

            return;
          }

          setInvitedUsers(selectedUsers);
          setSummary(data);
        },
      },
    });
  };

  return {
    selection,
    selectedCount: selectedUsers.length,
    isConfirmOpen: isModalOpen,
    isSending,
    openBulkInvite: openModal,
    closeBulkInvite: closeModal,
    confirmBulkInvite,
    summary,
    invitedUsers,
    clearSummary: () => setSummary(null),
  };
};
