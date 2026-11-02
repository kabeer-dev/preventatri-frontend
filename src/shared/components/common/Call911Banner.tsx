'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {radius} from '@/@core/theme/spacing';
import useTranslation from '@/shared/hooks/useTranslation';

const Call911Banner = () => {
  const {t} = useTranslation();

  return (
    <Box
      role='alert'
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        px: 3,
        py: 2,
        borderRadius: `${radius.sm}px`,
        backgroundColor: 'customColors.severityCriticalBg',
        border: '1px solid',
        borderColor: 'customColors.severityCriticalBar',
        color: 'customColors.severityCriticalFg',
      }}
    >
      <Icon icon='mdi:phone-alert' fontSize={18} />

      <Typography variant='small' component='p' sx={{m: 0, minWidth: 0}}>
        <Box component='span' sx={{fontWeight: 700}}>
          {t('call911Banner.title')}.
        </Box>{' '}
        {t('call911Banner.message')}
      </Typography>
    </Box>
  );
};

export default Call911Banner;
