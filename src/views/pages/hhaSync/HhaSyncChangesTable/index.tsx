'use client';

import DataTable from '@/shared/components/common/table/DataTable';
import {LIST_TYPES} from '@/shared/constants/general';
import {HHA_SYNC_URL_KEYS} from '@/shared/constants/hhaSyncHistory';
import {LIST_TAB_ALL} from '@/shared/constants/listToolbar';
import {HHA_SYNC_CHANGE_TABS} from '@/shared/constants/listToolbarTabs';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useHhaSyncChangeFilters} from '@/shared/hooks/useHhaSyncListFilters';
import {useListTabs} from '@/shared/hooks/useListTabs';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  HhaSyncChange,
  HhaSyncRunScopedTableProps,
} from '@/shared/interfaces/hhaSyncHistory';
import {hhaExchangeQueries} from '@/shared/reactQuery';

import {getHhaSyncChangeColumns} from './columns';

// Every record the sync created or changed, field by field.
const HhaSyncChangesTable = ({runId}: HhaSyncRunScopedTableProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const {useFetchHhaSyncChangesList} = hhaExchangeQueries();

  const {tabs, tabParams} = useListTabs({
    urlKey: HHA_SYNC_URL_KEYS.changeResource,
    ariaLabel: t('hhaSyncHistory.tabs.changeResourceAriaLabel'),
    options: HHA_SYNC_CHANGE_TABS,
    defaultValue: LIST_TAB_ALL,
  });

  const {filterParams, toolbarFilters} = useHhaSyncChangeFilters();

  const {
    filteredData: changes,
    isLoading,
    reactQueryData,
    tablePaginationProps,
  } = useServerSideListFilters<HhaSyncChange>({
    listType: LIST_TYPES.syncChanges,
    queryToCall: useFetchHhaSyncChangesList,
    dataKey: LIST_TYPES.syncChanges.value,
    baseParams: {...tabParams, ...filterParams, runId},
    urlKeyPrefix: HHA_SYNC_URL_KEYS.changesPrefix,
  });

  return (
    <DataTable<HhaSyncChange>
      rows={changes}
      columns={getHhaSyncChangeColumns({t, zone})}
      loading={isLoading || reactQueryData.isFetching}
      noRowsLabel={t('hhaSyncHistory.changes.noRowsLabel')}
      serverSidePagination={tablePaginationProps}
      toolbar={{tabs, filters: toolbarFilters}}
      gridSx={{'& .MuiDataGrid-cell': {alignItems: 'flex-start'}}}
      getRowHeight={() => 'auto'}
    />
  );
};

export default HhaSyncChangesTable;
