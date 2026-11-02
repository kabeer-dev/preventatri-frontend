'use client';

import Box from '@mui/material/Box';

import AlertSummaryCards from '@/shared/components/common/alertSummary';
import {TRIAGE_SUMMARY_CARDS} from '@/shared/constants/alertSummary';
import {LIST_TAB_ALL, LIST_TAB_URL_KEY} from '@/shared/constants/listToolbar';
import {TRIAGE_ALERT_LIST_TABS} from '@/shared/constants/listToolbarTabs';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import {
  TRIAGE_ALERTS_LIST_CONFIG,
  TRIAGE_ALERTS_URL_KEY_PREFIX,
} from '@/shared/constants/triageEngine';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useListTabs} from '@/shared/hooks/useListTabs';
import useTranslation from '@/shared/hooks/useTranslation';
import {useTriageAlertFilters} from '@/shared/hooks/useTriageAlertFilters';
import {TriageAlert} from '@/shared/interfaces/triageEngine';
import {useQueries} from '@/shared/reactQuery/triageEngine/queries';

import AlertsTable from './AlertsTable';

const TriageEnginePage = () => {
  const {useFetchTriageEngineStats, useFetchTriageEngineAlerts} = useQueries();

  const {data: counts, isLoading: isStatsLoading} = useFetchTriageEngineStats(
    {}
  );

  const {t} = useTranslation();

  const {tabs, tabParams} = useListTabs({
    urlKey: LIST_TAB_URL_KEY,
    ariaLabel: t('triageEngine.alerts.tabs.ariaLabel'),
    options: TRIAGE_ALERT_LIST_TABS,
    defaultValue: LIST_TAB_ALL,
  });

  const {filterParams, toolbarFilters} = useTriageAlertFilters();

  const {
    filteredData: alerts,
    isLoading: isAlertsLoading,
    tablePaginationProps,
  } = useServerSideListFilters<TriageAlert>({
    listType: TRIAGE_ALERTS_LIST_CONFIG,
    queryToCall: useFetchTriageEngineAlerts,
    dataKey: TRIAGE_ALERTS_LIST_CONFIG.value,
    urlKeyPrefix: TRIAGE_ALERTS_URL_KEY_PREFIX,
    baseParams: {...tabParams, ...filterParams, ...SUB_ROUTE_PARAMS},
  });

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
      <AlertSummaryCards
        cards={TRIAGE_SUMMARY_CARDS}
        counts={counts}
        isLoading={isStatsLoading}
      />

      <AlertsTable
        alerts={alerts}
        isLoading={isAlertsLoading}
        paginationProps={tablePaginationProps}
        toolbar={{tabs, filters: toolbarFilters}}
      />
    </Box>
  );
};

export default TriageEnginePage;
