'use client';

import DataTable from '@/shared/components/common/table/DataTable';
import {getTriageAlertHref} from '@/shared/constants/triageEngine';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {AlertsTableProps, TriageAlert} from '@/shared/interfaces/triageEngine';

import {getTriageAlertColumns} from './columns';

const AlertsTable = ({
  alerts,
  isLoading,
  paginationProps,
  toolbar,
}: AlertsTableProps) => {
  const {t} = useTranslation();
  const router = useLocaleRouter();

  return (
    <DataTable<TriageAlert>
      rows={alerts}
      columns={getTriageAlertColumns({t})}
      loading={isLoading}
      noRowsLabel={t('triageEngine.alerts.emptyMessage')}
      toolbar={toolbar}
      serverSidePagination={paginationProps}
      onRowClick={(params) =>
        router.push({url: getTriageAlertHref({alert: params.row})})
      }
    />
  );
};

export default AlertsTable;
