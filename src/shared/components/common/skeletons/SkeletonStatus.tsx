'use client';

import Box from '@mui/material/Box';
import {visuallyHidden} from '@mui/utils';

import useTranslation from '@/shared/hooks/useTranslation';

const SkeletonStatus = () => {
  const {t} = useTranslation();

  return (
    <Box role='status' sx={visuallyHidden}>
      {t('common.loading')}
    </Box>
  );
};

export default SkeletonStatus;
