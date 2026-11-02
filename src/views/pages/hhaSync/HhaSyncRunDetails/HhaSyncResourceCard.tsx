'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import {HHA_SYNC_RUN_STATUS} from '@/shared/constants/hhaSyncHistory';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncResourceCardProps} from '@/shared/interfaces/hhaSyncHistory';
import {
  resolveResourceLabel,
  resolveResourceOutcome,
  resolveSyncChip,
} from '@/shared/utils/hhaSyncHistoryUtils';

const COUNTER_KEY = 'hhaSyncHistory.runs.detail.counters';

// One resource's counters within a run.
const HhaSyncResourceCard = ({summary}: HhaSyncResourceCardProps) => {
  const {t} = useTranslation();

  const chip = resolveSyncChip({
    map: HHA_SYNC_RUN_STATUS,
    value: resolveResourceOutcome({summary}),
    t,
  });

  const linksChanged =
    (summary.countiesResolved || 0) +
    (summary.primaryRegionsChanged || 0) +
    (summary.nurseLinksChanged || 0) +
    (summary.caseManagerLinksChanged || 0);

  // Runs stored before the failed/blocking/warning split lack them: hidden, not 0.
  const counters = [
    {key: 'seen', value: summary.seen},
    {key: 'created', value: summary.created},
    {key: 'updated', value: summary.updated},
    {key: 'skipped', value: summary.skipped},
    {key: 'failed', value: summary.failed},
    {key: 'linksChanged', value: linksChanged},
    {key: 'emailsChanged', value: summary.emailsChanged},
    {key: 'exceptions', value: summary.exceptionCount},
    {key: 'blocking', value: summary.blockingCount},
    {key: 'warnings', value: summary.warningCount},
  ].filter(({value}) => value !== undefined);

  return (
    <Card variant='outlined' sx={{p: 4}}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='subtitle1' sx={{fontWeight: 600}}>
          {resolveResourceLabel({resource: summary.resource, t})}
        </Typography>
        <CustomChip
          skin='light'
          size='small'
          label={chip.label}
          color={chip.color}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)'},
          gap: 3,
        }}
      >
        {counters.map(({key, value}) => (
          <Box key={key}>
            <Typography variant='caption' sx={{color: 'text.secondary'}}>
              {t(`${COUNTER_KEY}.${key}`)}
            </Typography>
            <Typography variant='body1' sx={{fontWeight: 600}}>
              {value || 0}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default HhaSyncResourceCard;
