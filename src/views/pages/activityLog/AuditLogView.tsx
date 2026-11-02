'use client';

import {useState} from 'react';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {layout} from '@/@core/theme/spacing';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {ACTIVITY_LOG_EXPORT} from '@/shared/constants/activityLog';
import {LIST_TYPES} from '@/shared/constants/general';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useActivityLogFilters} from '@/shared/hooks/useActivityLogFilters';
import useTranslation from '@/shared/hooks/useTranslation';
import {AuditLogEntry} from '@/shared/interfaces/activityLog';
import {activityLogQueries} from '@/shared/reactQuery';

import ActivityLogDetails from './ActivityLogDetails';
import ActivityLogExportDialog from './ActivityLogExportDialog';
import ActivityLogFiltersBar from './ActivityLogFiltersBar';
import ActivityLogTable from './ActivityLogTable';

// The audit trail: who did what to which record, with filters, an export and
// a details panel for the selected event.
const AuditLogView = () => {
  const {t} = useTranslation();
  const {useFetchActivityLogList} = activityLogQueries();

  const {filterParams, toolbarFilters, dateRange, setDateRangeFilter} =
    useActivityLogFilters();

  const {
    filteredData: logs,
    isLoading,
    reactQueryData,
    tablePaginationProps,
  } = useServerSideListFilters<AuditLogEntry>({
    listType: LIST_TYPES.activityLog,
    queryToCall: useFetchActivityLogList,
    dataKey: LIST_TYPES.activityLog.value,
    baseParams: filterParams,
  });

  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <>
      <TopBarSlot side='right'>
        <Button
          variant='contained'
          startIcon={
            <Icon
              icon={ACTIVITY_LOG_EXPORT.buttonIcon}
              fontSize={layout.topBarActionIconSize}
            />
          }
          onClick={() => setIsExportOpen(true)}
        >
          {t('activityLog.export.button')}
        </Button>
      </TopBarSlot>

      <ActivityLogExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: {xs: 'column', lg: 'row'},
          alignItems: {xs: 'stretch', lg: 'flex-start'},
          gap: 3,
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 3.5,
          }}
        >
          <ActivityLogFiltersBar
            toolbarFilters={toolbarFilters}
            dateRange={dateRange}
            onDateRangeChange={setDateRangeFilter}
            eventsCount={tablePaginationProps.rowCount}
            isRefreshing={reactQueryData.isFetching}
            onRefresh={() => reactQueryData.refetch()}
          />

          <ActivityLogTable
            logs={logs}
            isLoading={isLoading || reactQueryData.isFetching}
            selectedLogId={selectedLog?.id}
            onSelectLog={({log}) => setSelectedLog(log)}
            paginationProps={tablePaginationProps}
          />
        </Box>

        {selectedLog && (
          <Box
            sx={{
              width: {xs: '100%', lg: 380},
              flexShrink: 0,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <ActivityLogDetails
              log={selectedLog}
              onClose={() => setSelectedLog(null)}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default AuditLogView;
