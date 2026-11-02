'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import useTranslation from '@/shared/hooks/useTranslation';
import {ReportErrorStateProps} from '@/shared/interfaces/reports';

const ReportErrorState = ({onRetry}: ReportErrorStateProps) => {
  const {t} = useTranslation();

  return (
    <Box
      role='alert'
      className='flex flex-wrap items-center justify-center gap-2 py-6'
    >
      <Typography variant='small' className='text-ink-subtle'>
        {t('reports.loadError')}
      </Typography>
      <Button variant='text' size='small' onClick={() => onRetry()}>
        {t('reports.retry')}
      </Button>
    </Box>
  );
};

export default ReportErrorState;
