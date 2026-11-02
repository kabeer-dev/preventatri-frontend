'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ActivityTimeline from '@/shared/components/common/ActivityTimeline';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncRunDetailsUIProps} from '@/shared/interfaces/hhaSyncHistory';
import {
  buildRunTimeline,
  orderRunSummaries,
} from '@/shared/utils/hhaSyncHistoryUtils';

import HhaSyncResourceCard from './HhaSyncResourceCard';
import HhaSyncRunRecords from './HhaSyncRunRecords';
import HhaSyncRunSummaryCard from './HhaSyncRunSummaryCard';

const KEY = 'hhaSyncHistory.runs.detail';

// Summary and timeline side by side, each record type's counters, then the records.
const HhaSyncRunDetailsUI = ({run}: HhaSyncRunDetailsUIProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 6}}>
      <Box
        sx={{
          display: 'grid',
          gap: 6,
          alignItems: 'start',
          gridTemplateColumns: {xs: '1fr', lg: '5fr 7fr'},
        }}
      >
        <HhaSyncRunSummaryCard run={run} />
        <ActivityTimeline
          title={t(`${KEY}.timelineTitle`)}
          entries={buildRunTimeline({run, t, zone})}
        />
      </Box>

      <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
        <Typography variant='h6'>{t(`${KEY}.resourcesTitle`)}</Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              xl: 'repeat(3, 1fr)',
            },
          }}
        >
          {orderRunSummaries({run}).map((summary) => (
            <HhaSyncResourceCard key={summary.resource} summary={summary} />
          ))}
        </Box>
      </Box>

      <HhaSyncRunRecords runId={run.id} />
    </Box>
  );
};

export default HhaSyncRunDetailsUI;
