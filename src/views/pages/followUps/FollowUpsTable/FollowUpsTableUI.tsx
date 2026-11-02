'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import DataTable from '@/shared/components/common/table/DataTable';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  FollowUpsTableUIProps,
  FollowUpTask,
} from '@/shared/interfaces/followUp';

import {getFollowUpColumns} from './columns';
import FollowUpOverdueBanner from './FollowUpOverdueBanner';

const FollowUpsTableUI = ({
  tasks,
  isLoading = false,
  paginationProps,
  toolbar,
  onRowClick,
  onAddClick,
  canCreate = false,
  overdueSummary,
  onShowOverdue,
  title,
  noRowsLabel,
}: FollowUpsTableUIProps) => {
  const {t} = useTranslation();

  const columns = getFollowUpColumns({t});

  return (
    <Box>
      {canCreate && onAddClick && (
        <TopBarSlot side='right'>
          <Button variant='contained' onClick={onAddClick}>
            {t('followUps.table.addButton')}
          </Button>
        </TopBarSlot>
      )}

      {overdueSummary && (
        <FollowUpOverdueBanner
          summary={overdueSummary}
          onShowOverdue={onShowOverdue}
        />
      )}

      <DataTable<FollowUpTask>
        rows={tasks}
        columns={columns}
        loading={isLoading}
        title={title}
        noRowsLabel={noRowsLabel ?? t('followUps.table.noRowsLabel')}
        toolbar={toolbar}
        serverSidePagination={paginationProps}
        onRowClick={(params) => onRowClick({task: params.row as FollowUpTask})}
      />
    </Box>
  );
};

export default FollowUpsTableUI;
