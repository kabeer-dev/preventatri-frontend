'use client';

import {GridRowParams} from '@mui/x-data-grid';

import DataTable from '@/shared/components/common/table/DataTable';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  ActivityLogTableProps,
  AuditLogEntry,
} from '@/shared/interfaces/activityLog';

import {getActivityLogColumns} from './columns';

const ActivityLogTable = ({
  logs,
  isLoading = false,
  selectedLogId,
  onSelectLog,
  paginationProps,
}: ActivityLogTableProps) => {
  const {t} = useTranslation();

  const columns = getActivityLogColumns({t});

  return (
    <DataTable<AuditLogEntry>
      rows={logs}
      columns={columns}
      loading={isLoading}
      noRowsLabel={t('activityLog.table.noRowsLabel')}
      onRowClick={(params: GridRowParams) =>
        onSelectLog({log: params.row as AuditLogEntry})
      }
      rowHeight={64}
      serverSidePagination={paginationProps}
      getRowClassName={({id}) =>
        id === selectedLogId ? 'activity-log-row--selected' : ''
      }
      gridSx={{
        '& .MuiDataGrid-row': {borderLeft: '3px solid transparent'},
        '& .MuiDataGrid-row.activity-log-row--selected': {
          borderLeftColor: 'primary.main',
          backgroundColor: 'action.selected',
        },
      }}
    />
  );
};

export default ActivityLogTable;
