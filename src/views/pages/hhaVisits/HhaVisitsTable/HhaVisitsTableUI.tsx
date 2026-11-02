'use client';

import DataTable from '@/shared/components/common/table/DataTable';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaVisit, HhaVisitsTableUIProps} from '@/shared/interfaces/hhaVisit';

import {getHhaVisitColumns} from './columns';

/**
 * Presentational component for the HHA Visits table. Read-only: no add
 * button, no row actions -- the only control is the Sync button the caller
 * places in actionSlot.
 */
const HhaVisitsTableUI = ({
  visits,
  isLoading = false,
  paginationProps,
  toolbar,
  actionSlot,
  onRowClick,
  title,
}: HhaVisitsTableUIProps) => {
  const {t} = useTranslation();

  const columns = getHhaVisitColumns({t});

  return (
    <>
      {actionSlot && <TopBarSlot side='right'>{actionSlot}</TopBarSlot>}

      <DataTable<HhaVisit>
        rows={visits}
        columns={columns}
        title={title}
        loading={isLoading}
        noRowsLabel={t('hhaVisits.table.noRowsLabel')}
        serverSidePagination={paginationProps}
        toolbar={toolbar}
        onRowClick={(params) => onRowClick({visit: params.row as HhaVisit})}
      />
    </>
  );
};

export default HhaVisitsTableUI;
