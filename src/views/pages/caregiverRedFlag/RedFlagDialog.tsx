'use client';

import {useId} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import BaseDialog from '@/shared/components/common/modals/BaseDialog';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';

import RedFlagForm from './RedFlagForm';
import RedFlagFormSkeleton from './RedFlagFormSkeleton';
import RedFlagSentView from './RedFlagSentView';
import useRedFlagForm from './useRedFlagForm';

interface Props {
  patientId: string;
  onClose: () => void;
}

/** W04: the red flag form over whatever desktop page the caregiver is on. */
const RedFlagDialog = ({patientId, onClose}: Props) => {
  const {t} = useTranslation();
  const titleId = useId();
  const {push} = useLocaleRouter();

  const state = useRedFlagForm({defaultPatientId: patientId});

  const handleBackToToday = () => {
    onClose();
    push({url: DASHBOARD_ROUTES.home()});
  };

  // While the flag is in flight every way out is shut: the backdrop, Escape,
  // the X and Cancel. Closing early and reopening would send the nurse the
  // same emergency twice.
  return (
    <BaseDialog
      isOpen
      fullWidth
      maxWidth='sm'
      ariaLabelledBy={titleId}
      onClose={onClose}
      disableBackdropClick={state.isSubmitting}
      disableEscapeKeyDown={state.isSubmitting}
      disableCloseButton={state.isSubmitting}
    >
      <DialogTitle
        id={titleId}
        sx={{display: 'flex', alignItems: 'center', gap: 2.5, pr: 16}}
      >
        <Box component='span' sx={{display: 'flex', color: 'error.main'}}>
          <Icon icon='mdi:flag-outline' fontSize={18} />
        </Box>

        <Typography
          component='span'
          sx={{fontSize: '1.125rem', fontWeight: 700}}
        >
          {t('caregiverRedFlag.title')}
        </Typography>

        <Typography
          component='span'
          sx={{fontSize: '0.78125rem', color: 'text.secondary'}}
        >
          {t('caregiverRedFlag.subtitle')}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {state.isSent ? (
          <RedFlagSentView patientFirstName={state.sentPatientFirstName} />
        ) : state.isPatientsLoading ? (
          <RedFlagFormSkeleton variant='dialog' />
        ) : (
          <RedFlagForm state={state} variant='dialog' />
        )}
      </DialogContent>

      <DialogActions sx={{gap: 2, px: 5, py: 3}}>
        {state.isSent ? (
          <Button variant='contained' onClick={handleBackToToday}>
            {t('caregiverPortal.backToToday')}
          </Button>
        ) : (
          <>
            <Button
              color='secondary'
              onClick={onClose}
              disabled={state.isSubmitting}
            >
              {t('caregiverRedFlag.cancel')}
            </Button>

            <Button
              variant='contained'
              color='error'
              onClick={state.onSubmit}
              loading={state.isSubmitting}
              disabled={!state.isValid || state.isSubmitting}
            >
              {t('caregiverRedFlag.send')}
            </Button>
          </>
        )}
      </DialogActions>
    </BaseDialog>
  );
};

export default RedFlagDialog;
