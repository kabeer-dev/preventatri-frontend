'use client';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import {CONFIRM_DIALOG_IDS} from '@/shared/constants/common';
import useTranslation from '@/shared/hooks/useTranslation';
import {ConfirmationModalProps} from '@/shared/interfaces/modals';

import BaseDialog from './BaseDialog';

export const ConfirmationModal = ({
  title,
  isOpen,
  content,
  dismissLabel,
  confirmLabel,
  onConfirm,
  confirmLoading = false,
  disableConfirm = false,
  onCancel,
  confirmButtonColor = 'error',
  width,
  maxWidth = 'xs',
}: ConfirmationModalProps) => {
  const {t} = useTranslation();

  const resolvedCancelLabel = dismissLabel ?? t('confirmDialog.cancelLabel');
  const resolvedConfirmLabel = confirmLabel ?? t('confirmDialog.confirmLabel');

  const handleClose = () => {
    if (confirmLoading) return;
    onCancel();
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={handleClose}
      width={width}
      maxWidth={maxWidth}
      disableBackdropClick
      disableEscapeKeyDown
      disableCloseButton={confirmLoading}
      ariaLabelledBy={CONFIRM_DIALOG_IDS.TITLE}
      ariaDescribedBy={CONFIRM_DIALOG_IDS.DESCRIPTION}
    >
      <DialogTitle id={CONFIRM_DIALOG_IDS.TITLE} sx={{pr: 16}}>
        {title}
      </DialogTitle>
      <DialogContent>
        {typeof content === 'string' ? (
          <DialogContentText id={CONFIRM_DIALOG_IDS.DESCRIPTION}>
            {content}
          </DialogContentText>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions
        className='dialog-actions-dense pb-4'
        sx={{flexWrap: 'wrap'}}
      >
        <Button
          variant='outlined'
          onClick={onCancel}
          disabled={confirmLoading}
          sx={{whiteSpace: 'nowrap'}}
        >
          {resolvedCancelLabel}
        </Button>
        <Button
          variant='contained'
          onClick={onConfirm}
          color={confirmButtonColor}
          loading={confirmLoading}
          disabled={disableConfirm}
          sx={{whiteSpace: 'nowrap'}}
        >
          {resolvedConfirmLabel}
        </Button>
      </DialogActions>
    </BaseDialog>
  );
};
