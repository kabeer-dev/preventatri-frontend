'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import useTranslation from '@/shared/hooks/useTranslation';
import {NurseCoverageRowProps} from '@/shared/interfaces/region';
import {joinNurseNames} from '@/shared/utils/nurseUtils';

const NurseCoverageRow = ({label, nurses}: NurseCoverageRowProps) => {
  const {t} = useTranslation();

  const assignedCount = nurses?.length || 0;
  const names = joinNurseNames({nurses});
  const isUncovered = assignedCount === 0;

  const value =
    names ||
    t(isUncovered ? 'region.card.unassigned' : 'region.card.nurseCount', {
      count: assignedCount,
    });

  return (
    <Box className='flex items-start gap-2.5'>
      <Typography
        className='w-19 flex-none'
        sx={{fontSize: '12px', color: 'customColors.inkFaint'}}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          flex: '1 1 auto',
          minWidth: 0,
          fontSize: '12.5px',
          fontWeight: 600,
          color: isUncovered ? 'error.main' : 'text.primary',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export default NurseCoverageRow;
