'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {controlHeight, radius} from '@/@core/theme/spacing';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {useCaregiverRedFlag} from '@/shared/providers/CaregiverRedFlagProvider';

/**
 * The red flag row inside a content list. On a desktop it opens the dialog
 * over the page the caregiver is already on; on a phone it goes to the full
 * screen. Either way the patient the screen registered, if it did, is
 * preselected. The desktop sidebar raises a flag from its own nav item.
 */
const RaiseRedFlagAction = () => {
  const {t} = useTranslation();
  const {push} = useLocaleRouter();
  const {openRedFlag, currentPatient, preselectPatient} = useCaregiverRedFlag();

  const isDesktop = useIsDesktop();

  const patientId = currentPatient?.id;

  const handleClick = () => {
    if (isDesktop) {
      openRedFlag({patientId});

      return;
    }

    // The patient travels in memory, not in the URL.
    preselectPatient({patientId: patientId || null});
    push({url: DASHBOARD_ROUTES.redFlag.all()});
  };

  return (
    <ButtonBase
      onClick={handleClick}
      sx={{
        width: '100%',
        gap: 3,
        px: 4,
        justifyContent: 'flex-start',
        borderRadius: `${radius.md}px`,
        border: '1px solid',
        minHeight: controlHeight.xl + 8,
        borderColor: 'customColors.severityCriticalBg',
        color: 'error.main',
        backgroundColor: 'background.paper',
        '&:hover': {backgroundColor: 'customColors.severityCriticalBg'},
      }}
    >
      <Icon icon='mdi:flag-outline' fontSize={20} />
      <Typography
        component='span'
        sx={{fontSize: '0.9375rem', fontWeight: 700}}
      >
        {t('caregiverPortal.nav.raiseRedFlag')}
      </Typography>
      <Box
        component='span'
        sx={{
          ml: 'auto',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'customColors.inkFaint',
        }}
      >
        {t('caregiverPortal.nav.raiseRedFlagHint')}
      </Box>
    </ButtonBase>
  );
};

export default RaiseRedFlagAction;
