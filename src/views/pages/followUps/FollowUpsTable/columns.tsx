import {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';

import {FollowUpTask} from '@/shared/interfaces/followUp';
import {getPriorityConfig, getStatusConfig} from '@/shared/utils/followUpUtils';
import FollowUpChip from '@/views/pages/followUps/components/FollowUpChip';

import {AssigneeCell, DueCell, SourceCell, TaskCell} from './cells';

type FollowUpCellParams = GridRenderCellParams<FollowUpTask>;

export const getFollowUpColumns = ({
  t,
}: {
  t: (key: string) => string;
}): GridColDef[] => [
  {
    flex: 0.3,
    minWidth: 260,
    field: 'title',
    headerName: t('followUps.table.headers.task'),
    renderCell: ({row}: FollowUpCellParams) => <TaskCell task={row} />,
  },
  {
    flex: 0.18,
    minWidth: 180,
    field: 'assignee',
    headerName: t('followUps.table.headers.assignee'),
    sortable: false,
    renderCell: ({row}: FollowUpCellParams) => <AssigneeCell task={row} />,
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'priority',
    headerName: t('followUps.table.headers.priority'),
    sortable: false,
    renderCell: ({row}: FollowUpCellParams) => (
      <FollowUpChip
        config={getPriorityConfig({priority: row.priority})}
        fallbackLabel={row.priority}
      />
    ),
  },
  {
    flex: 0.2,
    minWidth: 210,
    field: 'dueAt',
    headerName: t('followUps.table.headers.due'),
    renderCell: ({row}: FollowUpCellParams) => <DueCell task={row} />,
  },
  {
    flex: 0.13,
    minWidth: 130,
    field: 'status',
    headerName: t('followUps.table.headers.status'),
    renderCell: ({row}: FollowUpCellParams) => (
      <FollowUpChip
        config={getStatusConfig({status: row.status})}
        fallbackLabel={row.status}
      />
    ),
  },
  {
    flex: 0.13,
    minWidth: 130,
    field: 'source',
    headerName: t('followUps.table.headers.source'),
    sortable: false,
    renderCell: ({row}: FollowUpCellParams) => <SourceCell task={row} />,
  },
];
