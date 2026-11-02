'use client';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import useTranslation from '@/shared/hooks/useTranslation';
import {SessionTimeoutModalProps} from '@/shared/interfaces/modals';

import BaseDialog from './BaseDialog';

export const SessionTimeoutModal = ({
  isOpen,
  onLogout,
  isLogoutPending = false,
}: SessionTimeoutModalProps) => {
  const {t} = useTranslation();

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={() => {}}
      disableBackdropClick
      disableEscapeKeyDown
      hideCloseButton
      ariaLabelledBy='session-timeout-title'
      ariaDescribedBy='session-timeout-description'
    >
      <DialogTitle id='session-timeout-title'>
        {t('auth.sessionTimeoutTitle')}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id='session-timeout-description'>
          {t('auth.sessionTimeoutMessage')}
        </DialogContentText>
      </DialogContent>

      <DialogActions className='dialog-actions-dense pb-4'>
        <Button
          variant='contained'
          onClick={onLogout}
          disabled={isLogoutPending}
          loading={isLogoutPending}
          autoFocus
        >
          {t('auth.logout')}
        </Button>
      </DialogActions>
    </BaseDialog>
  );
};
