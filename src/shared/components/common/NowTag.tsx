'use client';

import Typography from '@mui/material/Typography';

import {radius} from '@/@core/theme/spacing';
import useTranslation from '@/shared/hooks/useTranslation';
import {NowTagProps} from '@/shared/interfaces/uiComponents';

// Marks a live figure that ignores the selected period.
const NowTag = ({label}: NowTagProps) => {
  const {t} = useTranslation();

  return (
    <Typography
      component='span'
      variant='small'
      className='shrink-0'
      sx={{
        px: 1.5,
        fontWeight: 700,
        borderRadius: `${radius.full}px`,
        bgcolor: 'customColors.brandTint',
        color: 'primary.main',
      }}
    >
      {label || t('reports.now')}
    </Typography>
  );
};

export default NowTag;
