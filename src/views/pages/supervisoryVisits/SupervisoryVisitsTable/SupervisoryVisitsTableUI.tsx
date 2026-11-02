'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import DataTable from '@/shared/components/common/table/DataTable';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  SupervisoryVisit,
  SupervisoryVisitsTableUIProps,
} from '@/shared/interfaces/supervisoryVisit';

import {getSupervisoryVisitColumns} from './columns';

const SupervisoryVisitsTableUI = ({
  visits,
  isLoading = false,
  paginationProps,
  toolbar,
  onRowClick,
  onAddClick,
  canCreate = false,
  title,
  noRowsLabel,
}: SupervisoryVisitsTableUIProps) => {
  const {t} = useTranslation();

  const columns = getSupervisoryVisitColumns({t});

  return (
    <Box>
      {canCreate && onAddClick && (
        <TopBarSlot side='right'>
          <Button variant='contained' onClick={onAddClick}>
            {t('supervisoryVisits.table.addButton')}
          </Button>
        </TopBarSlot>
      )}

      <DataTable<SupervisoryVisit>
        rows={visits}
        columns={columns}
        loading={isLoading}
        title={title}
        noRowsLabel={noRowsLabel ?? t('supervisoryVisits.table.noRowsLabel')}
        toolbar={toolbar}
        serverSidePagination={paginationProps}
        onRowClick={(params) =>
          onRowClick({visit: params.row as SupervisoryVisit})
        }
      />
    </Box>
  );
};

export default SupervisoryVisitsTableUI;
