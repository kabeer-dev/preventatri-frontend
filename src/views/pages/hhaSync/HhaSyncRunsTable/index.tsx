'use client';

import DataTable from '@/shared/components/common/table/DataTable';
import {LIST_TYPES} from '@/shared/constants/general';
import {HHA_SYNC_URL_KEYS} from '@/shared/constants/hhaSyncHistory';
import {LIST_TAB_ALL} from '@/shared/constants/listToolbar';
import {HHA_SYNC_RUN_TABS} from '@/shared/constants/listToolbarTabs';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useListTabs} from '@/shared/hooks/useListTabs';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncRun} from '@/shared/interfaces/hhaSyncHistory';
import {hhaExchangeQueries} from '@/shared/reactQuery';

import {getHhaSyncRunColumns} from './columns';

// Every scheduled and manual run, newest first; a row opens its detail page.
const HhaSyncRunsTable = () => {
  const {t} = useTranslation();
  const router = useLocaleRouter();
  const {zone} = useOrganizationTimeZone();
  const {useFetchHhaSyncRunsList} = hhaExchangeQueries();

  const {tabs, tabParams} = useListTabs({
    urlKey: HHA_SYNC_URL_KEYS.runStatus,
    ariaLabel: t('hhaSyncHistory.tabs.runStatusAriaLabel'),
    options: HHA_SYNC_RUN_TABS,
    defaultValue: LIST_TAB_ALL,
  });

  const {
    filteredData: runs,
    isLoading,
    reactQueryData,
    tablePaginationProps,
  } = useServerSideListFilters<HhaSyncRun>({
    listType: LIST_TYPES.syncRuns,
    queryToCall: useFetchHhaSyncRunsList,
    dataKey: LIST_TYPES.syncRuns.value,
    baseParams: tabParams,
    urlKeyPrefix: HHA_SYNC_URL_KEYS.runsPrefix,
  });

  return (
    <DataTable<HhaSyncRun>
      rows={runs}
      columns={getHhaSyncRunColumns({t, zone})}
      loading={isLoading || reactQueryData.isFetching}
      noRowsLabel={t('hhaSyncHistory.runs.noRowsLabel')}
      serverSidePagination={tablePaginationProps}
      toolbar={{tabs}}
      onRowClick={(params) =>
        router.push({
          url: DASHBOARD_ROUTES.hhaSync.run({
            id: (params.row as HhaSyncRun).id,
          }),
        })
      }
    />
  );
};

export default HhaSyncRunsTable;
