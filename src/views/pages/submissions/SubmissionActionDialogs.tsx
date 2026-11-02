'use client';

import ReasonDialog from '@/shared/components/common/modals/ReasonDialog';
import {VoidReasonModal} from '@/shared/components/common/modals/VoidReasonModal';
import {SUBMISSION_REASON_MAX_LENGTH} from '@/shared/constants/assessmentChecklists';
import useTranslation from '@/shared/hooks/useTranslation';
import {SubmissionActionDialogsProps} from '@/shared/interfaces/submission';
import FollowUpFormModal from '@/views/pages/followUps/FollowUpFormModal';

const SubmissionActionDialogs = ({
  target,
  modals,
  handlers,
  pending,
}: SubmissionActionDialogsProps) => {
  const {t} = useTranslation();
  const name = target?.name || '';

  return (
    <>
      <VoidReasonModal
        isOpen={modals.voidModal.isModalOpen}
        title={t('submissions.voidTitle')}
        description={t('submissions.voidMessage', {name})}
        onCancel={handlers.closeAll}
        onConfirm={handlers.confirmVoid}
        confirmLoading={pending.isVoiding}
      />

      <ReasonDialog
        key={`skip-${modals.skipModal.isModalOpen}`}
        isOpen={modals.skipModal.isModalOpen}
        onClose={handlers.closeAll}
        onConfirm={handlers.confirmSkip}
        isLoading={pending.isSkipping}
        title={t('submissions.skipDialog.title')}
        message={t('submissions.skipDialog.message', {name})}
        reasonLabel={t('submissions.skipDialog.reason')}
        reasonPlaceholder={t('submissions.skipDialog.reasonPlaceholder')}
        confirmLabel={t('submissions.skipDialog.confirm')}
        dismissLabel={t('submissions.skipDialog.dismiss')}
        maxLength={SUBMISSION_REASON_MAX_LENGTH}
        confirmColor='primary'
      />

      {target && (
        <FollowUpFormModal
          isOpen={modals.followUpModal.isModalOpen}
          onClose={handlers.closeAll}
          onSubmit={handlers.submitFollowUp}
          isLoading={pending.isCreatingFollowUp}
          lockedPatient={Object.assign({id: target.patientId}, target.patient)}
        />
      )}
    </>
  );
};

export default SubmissionActionDialogs;
