'use client';

// PREVENT-772: reopen removed for now; uncomment to restore.
// import {ConfirmationModal} from '@/shared/components/common/modals';
import ReasonDialog from '@/shared/components/common/modals/ReasonDialog';
import {SUPERVISORY_VISIT_REASON_MAX_LENGTH} from '@/shared/constants/supervisoryVisits';
import useTranslation from '@/shared/hooks/useTranslation';
import {SupervisoryVisitDialogsProps} from '@/shared/interfaces/supervisoryVisit';
import FollowUpFormModal from '@/views/pages/followUps/FollowUpFormModal';
import SupervisoryVisitFormModal from '@/views/pages/supervisoryVisits/SupervisoryVisitFormModal';

import SupervisoryVisitCompleteDrawer from './SupervisoryVisitCompleteDrawer';

// Every modal the detail page can open. Each remounts on open (key) so its
// form starts clean.
const SupervisoryVisitDialogs = ({
  visit,
  actions: {modals, handlers, pending},
  onFollowUpSubmit,
  isCreatingFollowUp = false,
}: SupervisoryVisitDialogsProps) => {
  const {t} = useTranslation();

  return (
    <>
      <SupervisoryVisitFormModal
        isOpen={modals.editModal.isModalOpen}
        onClose={modals.editModal.closeModal}
        onSubmit={(values) => handlers.submitEdit({values, visit})}
        isLoading={pending.isUpdating}
        visit={visit}
      />

      <SupervisoryVisitCompleteDrawer
        key={String(modals.completeModal.isModalOpen)}
        visit={visit}
        isOpen={modals.completeModal.isModalOpen}
        onClose={modals.completeModal.closeModal}
        onSubmit={handlers.submitComplete}
        isLoading={pending.isCompleting}
      />

      <ReasonDialog
        key={`cancel-${modals.cancelModal.isModalOpen}`}
        isOpen={modals.cancelModal.isModalOpen}
        onClose={modals.cancelModal.closeModal}
        onConfirm={handlers.submitCancel}
        isLoading={pending.isCancelling}
        title={t('supervisoryVisits.cancelDialog.title')}
        message={t('supervisoryVisits.cancelDialog.message')}
        reasonLabel={t('supervisoryVisits.cancelDialog.reason')}
        reasonPlaceholder={t(
          'supervisoryVisits.cancelDialog.reasonPlaceholder'
        )}
        confirmLabel={t('supervisoryVisits.cancelDialog.confirm')}
        dismissLabel={t('supervisoryVisits.cancelDialog.dismiss')}
        maxLength={SUPERVISORY_VISIT_REASON_MAX_LENGTH}
      />

      <ReasonDialog
        key={`approve-${modals.approveModal.isModalOpen}`}
        isOpen={modals.approveModal.isModalOpen}
        onClose={modals.approveModal.closeModal}
        onConfirm={handlers.submitApprove}
        isLoading={pending.isApproving}
        title={t('supervisoryVisits.review.approveTitle')}
        message={t('supervisoryVisits.review.approveMessage')}
        reasonLabel={t('supervisoryVisits.review.noteLabel')}
        reasonPlaceholder={t('supervisoryVisits.review.notePlaceholder')}
        confirmLabel={t('supervisoryVisits.review.approveConfirm')}
        dismissLabel={t('supervisoryVisits.review.dismiss')}
        maxLength={SUPERVISORY_VISIT_REASON_MAX_LENGTH}
        confirmColor='primary'
        isReasonRequired={false}
      />

      <ReasonDialog
        key={`correction-${modals.correctionModal.isModalOpen}`}
        isOpen={modals.correctionModal.isModalOpen}
        onClose={modals.correctionModal.closeModal}
        onConfirm={handlers.submitCorrection}
        isLoading={pending.isRequestingCorrection}
        title={t('supervisoryVisits.review.correctionTitle')}
        message={t('supervisoryVisits.review.correctionMessage')}
        reasonLabel={t('supervisoryVisits.review.reasonLabel')}
        reasonPlaceholder={t('supervisoryVisits.review.reasonPlaceholder')}
        confirmLabel={t('supervisoryVisits.review.correctionConfirm')}
        dismissLabel={t('supervisoryVisits.review.dismiss')}
        maxLength={SUPERVISORY_VISIT_REASON_MAX_LENGTH}
        confirmColor='primary'
      />

      {/* PREVENT-772: reopen removed for now; uncomment to restore.
      <ConfirmationModal
        isOpen={modals.reopenModal.isModalOpen}
        title={t('supervisoryVisits.reopen.title')}
        content={t('supervisoryVisits.reopen.message')}
        confirmLabel={t('supervisoryVisits.reopen.confirm')}
        confirmButtonColor='primary'
        onConfirm={handlers.confirmReopen}
        onCancel={modals.reopenModal.closeModal}
        confirmLoading={pending.isReopening}
      /> */}

      <FollowUpFormModal
        isOpen={modals.followUpModal.isModalOpen}
        onClose={modals.followUpModal.closeModal}
        onSubmit={onFollowUpSubmit}
        isLoading={isCreatingFollowUp}
        lockedPatient={Object.assign({id: visit.patientId}, visit.patient)}
        linkedAlert={visit.source.alert}
      />
    </>
  );
};

export default SupervisoryVisitDialogs;
