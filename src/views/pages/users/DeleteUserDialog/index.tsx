'use client';

import {DeleteConfirmationModal} from '@/shared/components/common/modals/DeleteConfirmationModal';
import {SYSTEM_ROLES} from '@/shared/constants/common';
import useTranslation from '@/shared/hooks/useTranslation';
import {DeleteUserDialogProps} from '@/shared/interfaces/orgUser';
import {
  caregiverMutations,
  caseManagerMutations,
  nurseMutations,
} from '@/shared/reactQuery';

/**
 * Deletes one roster row through that role's own endpoint.
 *
 * Each role's delete runs its own guard server-side (active assignments,
 * assigned patients), so the row's role decides which mutation fires.
 */
const DeleteUserDialog = ({
  user,
  onClose,
  onDeleted = onClose,
}: DeleteUserDialogProps) => {
  const {t} = useTranslation();

  const {useDeleteNurseMutation} = nurseMutations();
  const {useDeleteCaregiverMutation} = caregiverMutations();
  const {useDeleteCaseManagerMutation} = caseManagerMutations();

  const {mutate: deleteNurse, isPending: isDeletingNurse} =
    useDeleteNurseMutation();

  const {mutate: deleteCaregiver, isPending: isDeletingCaregiver} =
    useDeleteCaregiverMutation();

  const {mutate: deleteCaseManager, isPending: isDeletingCaseManager} =
    useDeleteCaseManagerMutation();

  const DELETE_BY_ROLE: Record<string, (args: unknown) => void> = {
    [SYSTEM_ROLES.nurse.value]: deleteNurse,
    [SYSTEM_ROLES.caregiver.value]: deleteCaregiver,
    [SYSTEM_ROLES.caseManager.value]: deleteCaseManager,
  };

  const isDeleting =
    isDeletingNurse || isDeletingCaregiver || isDeletingCaseManager;

  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

  const handleDelete = () => {
    const deleteUser = DELETE_BY_ROLE[user.role];

    if (!deleteUser || !user.profileId) return;

    deleteUser({
      params: {id: user.profileId},
      callBackFuncs: {onSuccess: onDeleted},
    });
  };

  return (
    <DeleteConfirmationModal
      isOpen
      title={t('orgUsers.delete.title')}
      content={[t('orgUsers.delete.message', {name})]}
      dismissLabel={t('orgUsers.delete.cancel')}
      deleteLabel={t('orgUsers.delete.confirm')}
      onCancel={onClose}
      onDelete={handleDelete}
      deleteLoading={isDeleting}
      onClose={onClose}
    />
  );
};

export default DeleteUserDialog;
