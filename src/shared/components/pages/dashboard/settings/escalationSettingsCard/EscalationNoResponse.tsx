'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {ESCALATION_STEP_OPTIONS} from '@/shared/constants/settings';
import useTranslation from '@/shared/hooks/useTranslation';
import {EscalationNoResponseProps} from '@/shared/interfaces/settings';

const EscalationNoResponse = ({index, nextStep}: EscalationNoResponseProps) => {
  const {t} = useTranslation();

  const nextOption = nextStep
    ? ESCALATION_STEP_OPTIONS.find(({value}) => value === nextStep.type)
    : null;
  const nextFallbackKey = nextOption?.fallbackKey;

  const noResponseText = nextStep
    ? t(
        nextFallbackKey
          ? 'escalationSettings.escalatesToWithFallback'
          : 'escalationSettings.escalatesTo',
        {
          step: index + 2,
          name: nextOption ? t(nextOption.labelKey) : '',
          fallback: nextFallbackKey
            ? t(`escalationSettings.fallbacks.${nextFallbackKey}.label`)
            : '',
        }
      )
    : t('escalationSettings.finalStep');

  return (
    <Box
      className='flex flex-wrap gap-x-2 px-3 py-2'
      sx={{bgcolor: 'customColors.severityModerateBg'}}
    >
      <Typography
        variant='caption'
        sx={{fontWeight: 700, color: 'customColors.severityModerateFg'}}
      >
        {t('escalationSettings.ifNoResponse')}
      </Typography>
      <Typography variant='caption' sx={{color: 'text.secondary'}}>
        {noResponseText}
      </Typography>
    </Box>
  );
};

export default EscalationNoResponse;
