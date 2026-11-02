'use client';

import {useMemo} from 'react';

import {Icon} from '@iconify/react';
import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import Link from '@/shared/components/common/localeLink';
import DataTable from '@/shared/components/common/table/DataTable';
import ReportCard from '@/shared/components/pages/reports/ReportCard';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {
  REPORT_PATIENT_TRENDS,
  REPORT_PATIENTS_PAGE_SIZE,
  REPORT_SCORECARD_NUMERIC_COLUMN,
} from '@/shared/constants/reports';
import {SEVERITY_LEVELS} from '@/shared/constants/severity';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  ReportHighRiskPatient,
  ReportSectionProps,
} from '@/shared/interfaces/reports';
import {SeverityConfig} from '@/shared/interfaces/severity';
import {CellType} from '@/shared/interfaces/tables';
import {reportQueries} from '@/shared/reactQuery';
import {formatReportCount} from '@/shared/utils/reportFormat';

const HighRiskPatientsTable = ({params}: ReportSectionProps) => {
  const {t} = useTranslation();
  const {useFetchReportHighRiskPatients} = reportQueries();

  const {data, isLoading, isError, refetch} = useFetchReportHighRiskPatients({
    params,
  });

  const columns = useMemo((): GridColDef[] => {
    const alertCountCell = ({
      count,
      severity,
    }: {
      count: number;
      severity: SeverityConfig;
    }) =>
      count > 0 ? (
        <CustomChip
          label={formatReportCount({value: count})}
          className='tabular-nums'
          sx={{
            bgcolor: `customColors.${severity.bg}`,
            color: `customColors.${severity.fg}`,
            fontWeight: 700,
          }}
        />
      ) : (
        <Typography variant='small' className='text-ink-subtle tabular-nums'>
          {formatReportCount({value: count})}
        </Typography>
      );

    return [
      {
        flex: 0.18,
        minWidth: 180,
        sortable: false,
        field: 'lastName',
        headerName: t('reports.patients.headers.patient'),
        renderCell: ({row}: CellType<ReportHighRiskPatient>) => (
          <Typography
            noWrap
            variant='bodyStrong'
            component={Link}
            href={DASHBOARD_ROUTES.patients.single({id: row.patientId})}
            sx={{color: 'primary.main'}}
          >
            {t('reports.patients.name', {
              firstName: row.firstName,
              lastName: row.lastName,
            })}
          </Typography>
        ),
      },
      {
        flex: 0.12,
        minWidth: 130,
        sortable: false,
        field: 'countyName',
        headerName: t('reports.patients.headers.county'),
        renderCell: ({row}: CellType<ReportHighRiskPatient>) =>
          row.countyName ?? (
            <Typography variant='small' className='text-ink-subtle'>
              {t('reports.patients.noCounty')}
            </Typography>
          ),
      },
      {
        flex: 0.14,
        minWidth: 150,
        sortable: false,
        field: 'caseManager',
        headerName: t('reports.patients.headers.caseManager'),
        renderCell: ({row}: CellType<ReportHighRiskPatient>) =>
          row.caseManager ? (
            t('reports.patients.caseManagerName', {
              firstName: row.caseManager.firstName,
              lastName: row.caseManager.lastName,
            })
          ) : (
            <Typography variant='small' className='text-ink-subtle'>
              {t('reports.patients.unassigned')}
            </Typography>
          ),
      },
      {
        ...REPORT_SCORECARD_NUMERIC_COLUMN,
        minWidth: 80,
        field: 'redAlerts',
        headerName: t('reports.patients.headers.red'),
        renderCell: ({row}: CellType<ReportHighRiskPatient>) =>
          alertCountCell({
            count: row.redAlerts,
            severity: SEVERITY_LEVELS.critical,
          }),
      },
      {
        ...REPORT_SCORECARD_NUMERIC_COLUMN,
        minWidth: 90,
        field: 'yellowAlerts',
        headerName: t('reports.patients.headers.yellow'),
        renderCell: ({row}: CellType<ReportHighRiskPatient>) =>
          alertCountCell({
            count: row.yellowAlerts,
            severity: SEVERITY_LEVELS.moderate,
          }),
      },
      {
        ...REPORT_SCORECARD_NUMERIC_COLUMN,
        minWidth: 160,
        field: 'overdueFollowUps',
        headerName: t('reports.patients.headers.overdue'),
        renderCell: ({row}: CellType<ReportHighRiskPatient>) =>
          formatReportCount({value: row.overdueFollowUps}),
      },
      {
        flex: 0.1,
        minWidth: 130,
        sortable: false,
        field: 'trend',
        headerName: t('reports.patients.headers.trend'),
        renderCell: ({row}: CellType<ReportHighRiskPatient>) => {
          if (!row.trend) return null;

          const trend = REPORT_PATIENT_TRENDS[row.trend];

          return (
            <CustomChip
              label={t(trend.labelKey)}
              icon={<Icon icon={trend.icon} aria-hidden />}
              sx={{
                bgcolor: `customColors.${trend.bg}`,
                color: `customColors.${trend.fg}`,
                '& .MuiChip-icon': {color: 'inherit'},
              }}
            />
          );
        },
      },
    ];
  }, [t]);

  if (isError)
    return (
      <ReportCard
        title={t('reports.patients.title')}
        caption={t('reports.patients.caption')}
        isLoading={false}
        isError
        onRetry={refetch}
      >
        {null}
      </ReportCard>
    );

  return (
    <DataTable<ReportHighRiskPatient>
      title={t('reports.patients.title')}
      titleMeta={t('reports.patients.caption')}
      titleInCard
      rows={data?.patients ?? []}
      columns={columns}
      getRowId={(row) => row.patientId}
      loading={isLoading}
      noRowsLabel={t('reports.patients.empty')}
      defaultPageSize={REPORT_PATIENTS_PAGE_SIZE}
      pageSizeOptions={[REPORT_PATIENTS_PAGE_SIZE]}
    />
  );
};

export default HighRiskPatientsTable;
