'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import useTranslation from '@/shared/hooks/useTranslation';
import {EscalationFallbackRowProps} from '@/shared/interfaces/settings';

import {readOnlyValueSx, stepColumnsSx} from './styles';

const EscalationFallbackRow = ({
  fallbackKey,
  channelsLabel,
  deadlineLabel,
}: EscalationFallbackRowProps) => {
  const {t} = useTranslation();

  return (
    <Box sx={stepColumnsSx}>
      <Box className='flex min-w-0 items-start gap-1.5 pl-1'>
        <Icon
          icon='mdi:subdirectory-arrow-right'
          fontSize={18}
          className='mt-0.5 flex-none'
        />
        <Box className='min-w-0'>
          <Typography variant='body2' sx={{fontWeight: 600}}>
            {t(`escalationSettings.fallbacks.${fallbackKey}.label`)}
          </Typography>
          <Typography
            variant='caption'
            component='p'
            sx={{color: 'text.secondary'}}
          >
            {t(`escalationSettings.fallbacks.${fallbackKey}.hint`)}
          </Typography>
        </Box>
      </Box>
      <Typography variant='body2' noWrap sx={readOnlyValueSx}>
        {channelsLabel || 'N/A'}
      </Typography>
      <Typography variant='body2' noWrap sx={readOnlyValueSx}>
        {deadlineLabel}
      </Typography>
    </Box>
  );
};

export default EscalationFallbackRow;
