'use client';

import {useState} from 'react';

import DataTable from '@/shared/components/common/table/DataTable';
import {LIST_TYPES} from '@/shared/constants/general';
import {
  HHA_SYNC_EXCEPTION_ADMIN_STATUS,
  HHA_SYNC_URL_KEYS,
} from '@/shared/constants/hhaSyncHistory';
import {HHA_SYNC_EXCEPTION_TABS} from '@/shared/constants/listToolbarTabs';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useModal} from '@/shared/hooks/modals/useModal';
import {useHhaSyncExceptionFilters} from '@/shared/hooks/useHhaSyncListFilters';
import {useListTabs} from '@/shared/hooks/useListTabs';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  HhaSyncException,
  HhaSyncRunScopedTableProps,
} from '@/shared/interfaces/hhaSyncHistory';
import {hhaExchangeQueries} from '@/shared/reactQuery';
import HhaSyncExceptionDetailModal from '@/views/pages/hhaSync/HhaSyncExceptionDetailModal';

import {getHhaSyncExceptionColumns} from './columns';

// The worklist: one row per problem per record, open ones first.
const HhaSyncExceptionsTable = ({runId}: HhaSyncRunScopedTableProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const {useFetchHhaSyncExceptionsList} = hhaExchangeQueries();

  const {tabs, tabParams} = useListTabs({
    urlKey: HHA_SYNC_URL_KEYS.exceptionStatus,
    ariaLabel: t('hhaSyncHistory.tabs.exceptionStatusAriaLabel'),
    options: HHA_SYNC_EXCEPTION_TABS,
    defaultValue: HHA_SYNC_EXCEPTION_ADMIN_STATUS.open,
  });

  const {filterParams, toolbarFilters} = useHhaSyncExceptionFilters();

  const {
    filteredData: exceptions,
    isLoading,
    reactQueryData,
    tablePaginationProps,
  } = useServerSideListFilters<HhaSyncException>({
    listType: LIST_TYPES.syncExceptions,
    queryToCall: useFetchHhaSyncExceptionsList,
    dataKey: LIST_TYPES.syncExceptions.value,
    baseParams: {...tabParams, ...filterParams, runId},
    urlKeyPrefix: HHA_SYNC_URL_KEYS.exceptionsPrefix,
  });

  const {isModalOpen, openModal, closeModal} = useModal();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Read from the list so the dialog shows the row's latest status after an action.
  const selected = exceptions.find((row) => row.id === selectedId) || null;

  return (
    <>
      <DataTable<HhaSyncException>
        rows={exceptions}
        columns={getHhaSyncExceptionColumns({t, zone})}
        loading={isLoading || reactQueryData.isFetching}
        noRowsLabel={t('hhaSyncHistory.exceptions.noRowsLabel')}
        serverSidePagination={tablePaginationProps}
        toolbar={{tabs, filters: toolbarFilters}}
        onRowClick={(params) => {
          setSelectedId((params.row as HhaSyncException).id);
          openModal();
        }}
      />

      <HhaSyncExceptionDetailModal
        exception={selected}
        isOpen={isModalOpen && Boolean(selected)}
        onClose={closeModal}
      />
    </>
  );
};

export default HhaSyncExceptionsTable;
