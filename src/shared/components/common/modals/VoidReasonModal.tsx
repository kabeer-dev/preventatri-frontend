'use client';

import {useState} from 'react';

import TextField from '@mui/material/TextField';

import useTranslation from '@/shared/hooks/useTranslation';
import {VoidReasonModalProps} from '@/shared/interfaces/modals';

import {ConfirmationModal} from './ConfirmationModal';

export const VoidReasonModal = ({
  title,
  isOpen,
  description,
  onCancel,
  onConfirm,
  confirmLoading,
}: VoidReasonModalProps) => {
  const {t} = useTranslation();
  const [reason, setReason] = useState('');

  const handleCancel = () => {
    setReason('');
    onCancel();
  };

  const handleConfirm = () => {
    onConfirm({reason: reason.trim()});
    setReason('');
  };

  return (
    <ConfirmationModal
      title={title}
      isOpen={isOpen}
      content={
        <>
          {description}
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            maxRows={5}
            label={t('void.reasonLabel')}
            placeholder={t('void.reasonPlaceholder')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={confirmLoading}
            sx={{mt: description ? 2 : 0}}
          />
        </>
      }
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      confirmLoading={confirmLoading}
      disableConfirm={reason.trim().length === 0}
      confirmButtonColor='warning'
      confirmLabel={t('void.confirmButton')}
      dismissLabel={t('void.cancelButton')}
    />
  );
};
