'use client';

import ReasonDialog from '@/shared/components/common/modals/ReasonDialog';
import {FOLLOW_UP_CANCEL_REASON_MAX_LENGTH} from '@/shared/constants/followUps';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpCancelDialogProps} from '@/shared/interfaces/followUp';

const FollowUpCancelDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: FollowUpCancelDialogProps) => {
  const {t} = useTranslation();

  return (
    <ReasonDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={({reason}) => onConfirm({values: {reason}})}
      isLoading={isLoading}
      title={t('followUps.cancelDialog.title')}
      message={t('followUps.cancelDialog.message')}
      reasonLabel={t('followUps.cancelDialog.reason')}
      reasonPlaceholder={t('followUps.cancelDialog.reasonPlaceholder')}
      confirmLabel={t('followUps.cancelDialog.confirm')}
      dismissLabel={t('followUps.cancelDialog.dismiss')}
      maxLength={FOLLOW_UP_CANCEL_REASON_MAX_LENGTH}
    />
  );
};

export default FollowUpCancelDialog;
