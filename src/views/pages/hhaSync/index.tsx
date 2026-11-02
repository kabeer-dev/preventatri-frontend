'use client';

import {ComponentType} from 'react';

import Box from '@mui/material/Box';

import HhaSyncAction from '@/shared/components/common/HhaSyncAction';
import SegmentedTabs from '@/shared/components/common/inputs/SegmentedTabs';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {
  HHA_SYNC_URL_KEYS,
  HHA_SYNC_VIEWS,
} from '@/shared/constants/hhaSyncHistory';
import {HHA_SYNC_VIEW_TABS} from '@/shared/constants/listToolbarTabs';
import {useListTabs} from '@/shared/hooks/useListTabs';
import useTranslation from '@/shared/hooks/useTranslation';

import HhaSyncChangesTable from './HhaSyncChangesTable';
import HhaSyncCoordinatorsTable from './HhaSyncCoordinatorsTable';
import HhaSyncEmailConflictsTable from './HhaSyncEmailConflictsTable';
import HhaSyncExceptionsTable from './HhaSyncExceptionsTable';
import HhaSyncRunsTable from './HhaSyncRunsTable';

const VIEW_TABLES: Record<string, ComponentType> = {
  [HHA_SYNC_VIEWS.runs.value]: HhaSyncRunsTable,
  [HHA_SYNC_VIEWS.changes.value]: HhaSyncChangesTable,
  [HHA_SYNC_VIEWS.exceptions.value]: HhaSyncExceptionsTable,
  [HHA_SYNC_VIEWS.emails.value]: HhaSyncEmailConflictsTable,
  [HHA_SYNC_VIEWS.coordinators.value]: HhaSyncCoordinatorsTable,
};

// HHAeXchange sync history (runs, changes, exceptions) and the two admin
// worklists: shared emails and patient coordinators.
const HhaSyncPage = () => {
  const {t} = useTranslation();

  const {tabs} = useListTabs({
    urlKey: HHA_SYNC_URL_KEYS.view,
    ariaLabel: t('hhaSyncHistory.views.ariaLabel'),
    options: HHA_SYNC_VIEW_TABS,
    defaultValue: HHA_SYNC_VIEWS.exceptions.value,
  });

  const ActiveTable = VIEW_TABLES[tabs.value] || HhaSyncExceptionsTable;

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
      <TopBarSlot side='right'>
        <HhaSyncAction />
      </TopBarSlot>

      {/* A flex child would stretch the pill group to the full page width. */}
      <Box>
        <SegmentedTabs {...tabs} />
      </Box>

      <ActiveTable key={tabs.value} />
    </Box>
  );
};

export default HhaSyncPage;
