'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaCoordinatorListProps} from '@/shared/interfaces/hhaSyncHistory';
import {resolveCoordinatorStatus} from '@/shared/utils/hhaSyncHistoryUtils';

// A patient's HHAeXchange coordinators in HHA's order, each with what it is here.
const HhaCoordinatorList = ({coordinators}: HhaCoordinatorListProps) => {
  const {t} = useTranslation();

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5, py: 2}}>
      {coordinators.map((coordinator) => {
        const status = resolveCoordinatorStatus({coordinator, t});

        return (
          <Box
            key={coordinator.slot}
            sx={{display: 'flex', alignItems: 'center', gap: 2, minWidth: 0}}
          >
            <Typography noWrap variant='body2' sx={{minWidth: 0}}>
              {coordinator.name}
            </Typography>
            {status && (
              <CustomChip
                skin='light'
                size='small'
                label={status.label}
                color={status.color}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default HhaCoordinatorList;
