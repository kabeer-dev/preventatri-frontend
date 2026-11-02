'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';

import SegmentedTabs from '@/shared/components/common/inputs/SegmentedTabs';
import {HHA_SYNC_VIEWS} from '@/shared/constants/hhaSyncHistory';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncRunDetailsProps} from '@/shared/interfaces/hhaSyncHistory';
import HhaSyncChangesTable from '@/views/pages/hhaSync/HhaSyncChangesTable';
import HhaSyncExceptionsTable from '@/views/pages/hhaSync/HhaSyncExceptionsTable';

const KEY = 'hhaSyncHistory.runs.detail';

// The changes this run made and the exceptions it last reported.
const HhaSyncRunRecords = ({runId}: HhaSyncRunDetailsProps) => {
  const {t} = useTranslation();

  const [view, setView] = useState<string>(HHA_SYNC_VIEWS.changes.value);

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
      <SegmentedTabs
        value={view}
        ariaLabel={t(`${KEY}.recordsAriaLabel`)}
        options={[
          {value: HHA_SYNC_VIEWS.changes.value, label: t(`${KEY}.changesTab`)},
          {
            value: HHA_SYNC_VIEWS.exceptions.value,
            label: t(`${KEY}.exceptionsTab`),
          },
        ]}
        onChange={({value}) => setView(value)}
      />

      {view === HHA_SYNC_VIEWS.changes.value ? (
        <HhaSyncChangesTable runId={runId} />
      ) : (
        <HhaSyncExceptionsTable runId={runId} />
      )}
    </Box>
  );
};

export default HhaSyncRunRecords;
