'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import useTranslation from '@/shared/hooks/useTranslation';
import {DataTableCardHeaderProps} from '@/shared/interfaces/uiComponents';

const DataTableCardHeader = ({
  title,
  meta,
  total,
  action,
}: DataTableCardHeaderProps) => {
  const {t} = useTranslation();

  return (
    <Box className='border-rule-strong flex flex-wrap items-center gap-2.5 border-b px-4.5 py-3.5'>
      <Typography
        component='h3'
        sx={{fontSize: '0.96875rem', fontWeight: 700, lineHeight: 1.4}}
      >
        {title}
      </Typography>

      {total !== undefined && (
        <Box
          component='span'
          className='bg-rule text-ink-muted rounded-full px-2 py-0.75 text-[0.71875rem] font-semibold'
        >
          {t('table.total', {count: total})}
        </Box>
      )}

      {meta && (
        <Typography variant='small' sx={{color: 'text.disabled'}}>
          {meta}
        </Typography>
      )}

      {action && <Box className='ml-auto'>{action}</Box>}
    </Box>
  );
};

export default DataTableCardHeader;
