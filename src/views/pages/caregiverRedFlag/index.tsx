'use client';

import {useEffect} from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {layout} from '@/@core/theme/spacing';
import PinnedAction from '@/shared/components/caregiver/PinnedAction';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {useCaregiverRedFlag} from '@/shared/providers/CaregiverRedFlagProvider';

import RedFlagForm from './RedFlagForm';
import RedFlagFormSkeleton from './RedFlagFormSkeleton';
import RedFlagSentView from './RedFlagSentView';
import useRedFlagForm from './useRedFlagForm';

/**
 * C15 and C16 on the phone: the red flag form as its own screen, then the
 * sent state in its place. The patient is handed over by the provider when
 * the caregiver started from a patient page, and is picked here otherwise.
 */
const CaregiverRedFlagView = () => {
  const {t} = useTranslation();
  const {push, replace} = useLocaleRouter();
  const isDesktop = useIsDesktop();

  const {preselectedPatientId, preselectPatient, openRedFlag} =
    useCaregiverRedFlag();

  const state = useRedFlagForm({defaultPatientId: preselectedPatientId || ''});

  // The handover is for this one visit to the screen.
  useEffect(
    () => () => preselectPatient({patientId: null}),
    [preselectPatient]
  );

  // This screen is the phone's; a desktop raises the flag in the dialog.
  useEffect(() => {
    if (!isDesktop) return;

    openRedFlag({patientId: preselectedPatientId || undefined});
    replace({url: DASHBOARD_ROUTES.home()});
  }, [isDesktop, openRedFlag, preselectedPatientId, replace]);

  if (isDesktop) return null;

  if (state.isSent) {
    return (
      <Box sx={{width: '100%', maxWidth: layout.formMaxWidth, mx: 'auto'}}>
        <RedFlagSentView patientFirstName={state.sentPatientFirstName} />

        <PinnedAction
          label={t('caregiverPortal.backToToday')}
          href={DASHBOARD_ROUTES.home()}
        />
      </Box>
    );
  }

  if (state.isPatientsLoading) {
    return <RedFlagFormSkeleton variant='screen' />;
  }

  return (
    <Box sx={{width: '100%', maxWidth: layout.formMaxWidth, mx: 'auto'}}>
      <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 4}}>
        <IconButton
          aria-label={t('caregiverRedFlag.close')}
          disabled={state.isSubmitting}
          onClick={() => push({url: DASHBOARD_ROUTES.home()})}
          sx={{color: 'text.secondary', width: 40, height: 40}}
        >
          <Icon icon='mdi:close' fontSize={22} />
        </IconButton>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            color: 'error.main',
          }}
        >
          <Icon icon='mdi:flag-outline' fontSize={16} />

          <Typography
            component='h1'
            sx={{fontSize: '0.875rem', fontWeight: 700}}
          >
            {t('caregiverRedFlag.shortTitle')}
          </Typography>
        </Box>

        <Box sx={{width: 40}} />
      </Box>

      <RedFlagForm state={state} variant='screen' />

      <PinnedAction
        label={t('caregiverRedFlag.send')}
        color='error'
        onClick={state.onSubmit}
        isLoading={state.isSubmitting}
        isDisabled={!state.isValid || state.isSubmitting}
      />
    </Box>
  );
};

export default CaregiverRedFlagView;
