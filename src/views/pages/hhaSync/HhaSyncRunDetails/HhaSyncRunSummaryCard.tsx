'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

import CustomChip from '@/@core/components/mui/chip';
import {HHA_SYNC_RUN_STATUS} from '@/shared/constants/hhaSyncHistory';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncRunDetailsUIProps} from '@/shared/interfaces/hhaSyncHistory';
import {
  formatSyncDateTime,
  formatSyncDuration,
  resolveSyncChip,
  sumRunCounters,
} from '@/shared/utils/hhaSyncHistoryUtils';
import HhaSyncDetailRow from '@/views/pages/hhaSync/HhaSyncDetailRow';

const KEY = 'hhaSyncHistory.runs.detail';

// Who started the run, when, how long it took and what it left behind.
const HhaSyncRunSummaryCard = ({run}: HhaSyncRunDetailsUIProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();

  const chip = resolveSyncChip({
    map: HHA_SYNC_RUN_STATUS,
    value: run.status,
    t,
  });

  return (
    <Card>
      <CardHeader
        title={t(`${KEY}.summaryTitle`)}
        action={
          <CustomChip
            skin='light'
            size='small'
            label={chip.label}
            color={chip.color}
          />
        }
      />
      <CardContent>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2.5}}>
          <HhaSyncDetailRow label={t(`${KEY}.startedBy`)}>
            {run.requestedBy?.name || t(`${KEY}.auto`)}
          </HhaSyncDetailRow>
          <HhaSyncDetailRow label={t(`${KEY}.startedAt`)}>
            {formatSyncDateTime({value: run.startedAt, zone})}
          </HhaSyncDetailRow>
          <HhaSyncDetailRow label={t(`${KEY}.finishedAt`)}>
            {formatSyncDateTime({value: run.finishedAt, zone})}
          </HhaSyncDetailRow>
          <HhaSyncDetailRow label={t(`${KEY}.duration`)}>
            {formatSyncDuration({
              startedAt: run.startedAt,
              finishedAt: run.finishedAt,
            })}
          </HhaSyncDetailRow>
          <HhaSyncDetailRow label={t(`${KEY}.changes`)}>
            {run.changeCount || 0}
          </HhaSyncDetailRow>
          <HhaSyncDetailRow label={t(`${KEY}.exceptions`)}>
            {sumRunCounters({run}).exceptions}
          </HhaSyncDetailRow>
          {run.errorId && (
            <HhaSyncDetailRow label={t(`${KEY}.errorId`)}>
              {run.errorId}
            </HhaSyncDetailRow>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default HhaSyncRunSummaryCard;
