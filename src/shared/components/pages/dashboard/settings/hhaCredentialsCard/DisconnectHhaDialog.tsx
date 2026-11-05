'use client';

import {ConfirmationModal} from '@/shared/components/common/modals';
import useTranslation from '@/shared/hooks/useTranslation';
import {DisconnectHhaDialogProps} from '@/shared/interfaces/settings';

const DisconnectHhaDialog = ({
  isOpen,
  isPending,
  onCancel,
  onConfirm,
}: DisconnectHhaDialogProps) => {
  const {t} = useTranslation();

  return (
    <ConfirmationModal
      isOpen={isOpen}
      title={t('hhaCredentials.disconnectTitle')}
      content={t('hhaCredentials.disconnectContent')}
      confirmLabel={t('hhaCredentials.disconnect')}
      dismissLabel={t('hhaCredentials.cancel')}
      confirmLoading={isPending}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
};

export default DisconnectHhaDialog;
