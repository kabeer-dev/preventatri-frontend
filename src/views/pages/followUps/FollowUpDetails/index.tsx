'use client';

// PREVENT-772: reopen removed for now; uncomment to restore.
// import {ConfirmationModal} from '@/shared/components/common/modals';
import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {SYSTEM_ROLES} from '@/shared/constants/common';
import {
  FOLLOW_UP_TASK_OPEN_STATUSES,

  // PREVENT-772: reopen removed for now; uncomment to restore.
  // FOLLOW_UP_TASK_REOPENABLE_STATUSES,
} from '@/shared/constants/followUps';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {useFollowUpTaskActions} from '@/shared/hooks/useFollowUpTaskActions';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {
  FollowUpDetail,
  FollowUpDetailsProps,
  FollowUpTaskActions,
  FollowUpTaskPermissions,
} from '@/shared/interfaces/followUp';
import {followUpTaskQueries} from '@/shared/reactQuery';
import FollowUpFormModal from '@/views/pages/followUps/FollowUpFormModal';

import FollowUpCancelDialog from './FollowUpCancelDialog';
import FollowUpCompleteDrawer from './FollowUpCompleteDrawer';
import FollowUpDetailsUI from './FollowUpDetailsUI';

const FollowUpDetails = ({id}: FollowUpDetailsProps) => {
  const {t} = useTranslation();
  const {push} = useLocaleRouter();
  const {isAdmin, isCaseManager} = useUserRole();
  const {currentUser} = useGetLoggedInUser();

  const {useFetchFollowUpTask} = followUpTaskQueries();
  const {data, isLoading, isError} = useFetchFollowUpTask({id});

  const {modals, handlers, pending} = useFollowUpTaskActions({id});

  if (isLoading) return <PageSkeleton {...PAGE_SKELETONS.checklistRecord} />;

  const task: FollowUpDetail | undefined = data?.task;

  if (!task || isError) {
    return (
      <ContentNotAvailable
        title={t('followUps.detail.notFoundTitle')}
        message={t('followUps.detail.notFoundMessage')}
      />
    );
  }

  // Mirrors the backend: admins, the creator or a case manager manage a task,
  // unless it already sits with an admin; only its assignee completes it.
  const isOpen = FOLLOW_UP_TASK_OPEN_STATUSES.includes(task.status);
  const isCreator = task.createdBy === currentUser?.id;
  const isAssignee = task.assignee?.user?.id === currentUser?.id;
  const isAdminOwned = task.assignee?.role === SYSTEM_ROLES.admin.value;

  const canManage = isAdmin || (!isAdminOwned && (isCreator || isCaseManager));

  // PREVENT-772: reopen removed for now; uncomment to restore.
  // const canReopen = isAdmin || (!isAdminOwned && isCaseManager);

  const permissions: FollowUpTaskPermissions = {
    canEdit: isOpen && canManage,
    canCancel: isOpen && canManage,
    canComplete: isOpen && isAssignee,

    // canReopen:
    //   canReopen && FOLLOW_UP_TASK_REOPENABLE_STATUSES.includes(task.status),
  };

  // A checklist is answered one question at a time on its own page; a task
  // without one completes from the drawer here.
  const actions: FollowUpTaskActions = Object.assign({}, handlers, {
    onComplete: task.checklistTemplate
      ? () => push({url: DASHBOARD_ROUTES.followUps.checklist({id})})
      : handlers.onComplete,
  });

  return (
    <>
      <FollowUpDetailsUI
        task={task}
        permissions={permissions}
        actions={actions}
      />

      <FollowUpFormModal
        isOpen={modals.editModal.isModalOpen}
        onClose={modals.editModal.closeModal}
        onSubmit={(values) => handlers.submitEdit({values, task})}
        isLoading={pending.isUpdating}
        task={task}
      />

      <FollowUpCompleteDrawer
        key={String(modals.completeModal.isModalOpen)}
        task={task}
        isOpen={modals.completeModal.isModalOpen}
        onClose={modals.completeModal.closeModal}
        onSubmit={handlers.submitComplete}
        isLoading={pending.isCompleting}
      />

      <FollowUpCancelDialog
        key={`cancel-${modals.cancelModal.isModalOpen}`}
        isOpen={modals.cancelModal.isModalOpen}
        onClose={modals.cancelModal.closeModal}
        onConfirm={handlers.submitCancel}
        isLoading={pending.isCancelling}
      />

      {/* PREVENT-772: reopen removed for now; uncomment to restore.
      <ConfirmationModal
        isOpen={modals.reopenModal.isModalOpen}
        title={t('followUps.reopen.title')}
        content={t('followUps.reopen.message')}
        confirmLabel={t('followUps.reopen.confirm')}
        confirmButtonColor='primary'
        onConfirm={handlers.confirmReopen}
        onCancel={modals.reopenModal.closeModal}
        confirmLoading={pending.isReopening}
      /> */}
    </>
  );
};

export default FollowUpDetails;
