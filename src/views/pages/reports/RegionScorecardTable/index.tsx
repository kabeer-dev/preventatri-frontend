'use client';

import {useMemo} from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import NowTag from '@/shared/components/common/NowTag';
import DataTable from '@/shared/components/common/table/DataTable';
import ReportCard from '@/shared/components/pages/reports/ReportCard';
import {
  REPORT_SCORECARD_NUMERIC_COLUMN,
  REPORT_SCORECARD_PAGE_SIZE,
  REPORT_THRESHOLDS,
  REPORT_TONE_COLORS,
  REPORT_UNASSIGNED_REGION_KEY,
  REPORT_UNASSIGNED_REGION_ROW_ID,
} from '@/shared/constants/reports';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  ReportRegionRow,
  ReportSectionProps,
  ReportThreshold,
} from '@/shared/interfaces/reports';
import {CellType} from '@/shared/interfaces/tables';
import {reportQueries} from '@/shared/reactQuery';
import {
  formatReportCount,
  formatReportDuration,
  formatReportPercent,
  toneFor,
} from '@/shared/utils/reportFormat';

const RegionScorecardTable = ({params}: ReportSectionProps) => {
  const {t} = useTranslation();
  const {useFetchReportRegions} = reportQueries();

  const {data, isLoading, isError, refetch} = useFetchReportRegions({params});

  const columns = useMemo((): GridColDef[] => {
    // A custom header skips the grid's title styles, so the label repeats them.
    const nowHeader = ({label}: {label: string}) => (
      <Box className='flex items-center gap-1.5'>
        <Typography variant='eyebrow' sx={{color: 'customColors.inkFaint'}}>
          {label}
        </Typography>
        <NowTag />
      </Box>
    );

    const percentCell = ({
      value,
      thresholds,
    }: {
      value: number | null;
      thresholds: ReportThreshold;
    }) => (
      <Typography
        variant='bodyStrong'
        className='tabular-nums'
        sx={{color: REPORT_TONE_COLORS[toneFor({value, thresholds})]}}
      >
        {formatReportPercent({value})}
      </Typography>
    );

    return [
      {
        flex: 0.18,
        minWidth: 180,
        sortable: false,
        field: 'regionName',
        headerName: t('reports.regions.headers.region'),
        renderCell: ({row}: CellType<ReportRegionRow>) => (
          <Typography noWrap variant='bodyStrong'>
            {row.regionName ?? t(REPORT_UNASSIGNED_REGION_KEY)}
          </Typography>
        ),
      },
      {
        ...REPORT_SCORECARD_NUMERIC_COLUMN,
        minWidth: 170,
        field: 'activePatients',
        headerName: t('reports.regions.headers.activePatients'),
        renderHeader: () =>
          nowHeader({label: t('reports.regions.headers.activePatients')}),
        renderCell: ({row}: CellType<ReportRegionRow>) =>
          formatReportCount({value: row.activePatients}),
      },
      {
        ...REPORT_SCORECARD_NUMERIC_COLUMN,
        minWidth: 100,
        field: 'alerts',
        headerName: t('reports.regions.headers.alerts'),
        renderCell: ({row}: CellType<ReportRegionRow>) =>
          formatReportCount({value: row.alerts}),
      },
      {
        ...REPORT_SCORECARD_NUMERIC_COLUMN,
        minWidth: 100,
        field: 'slaCompliancePct',
        headerName: t('reports.regions.headers.sla'),
        renderCell: ({row}: CellType<ReportRegionRow>) =>
          percentCell({
            value: row.slaCompliancePct,
            thresholds: REPORT_THRESHOLDS.sla,
          }),
      },
      {
        ...REPORT_SCORECARD_NUMERIC_COLUMN,
        minWidth: 140,
        field: 'medianResolveSeconds',
        headerName: t('reports.regions.headers.medianResolve'),
        renderCell: ({row}: CellType<ReportRegionRow>) =>
          formatReportDuration({seconds: row.medianResolveSeconds}),
      },
      {
        ...REPORT_SCORECARD_NUMERIC_COLUMN,
        minWidth: 140,
        field: 'medianAcceptSeconds',
        headerName: t('reports.regions.headers.medianAccept'),
        renderCell: ({row}: CellType<ReportRegionRow>) =>
          formatReportDuration({seconds: row.medianAcceptSeconds}),
      },
      {
        ...REPORT_SCORECARD_NUMERIC_COLUMN,
        minWidth: 180,
        field: 'assessmentsOnTimePct',
        headerName: t('reports.regions.headers.assessments'),
        renderCell: ({row}: CellType<ReportRegionRow>) =>
          percentCell({
            value: row.assessmentsOnTimePct,
            thresholds: REPORT_THRESHOLDS.role,
          }),
      },
      {
        ...REPORT_SCORECARD_NUMERIC_COLUMN,
        minWidth: 160,
        field: 'overdueNow',
        headerName: t('reports.regions.headers.overdue'),
        renderHeader: () =>
          nowHeader({label: t('reports.regions.headers.overdue')}),
        renderCell: ({row}: CellType<ReportRegionRow>) =>
          formatReportCount({value: row.overdueNow}),
      },
    ];
  }, [t]);

  if (isError)
    return (
      <ReportCard
        title={t('reports.regions.title')}
        caption={t('reports.regions.caption')}
        isLoading={false}
        isError
        onRetry={refetch}
      >
        {null}
      </ReportCard>
    );

  return (
    <DataTable<ReportRegionRow>
      title={t('reports.regions.title')}
      titleMeta={t('reports.regions.caption')}
      titleInCard
      rows={data?.regions ?? []}
      columns={columns}
      getRowId={(row) => row.regionId ?? REPORT_UNASSIGNED_REGION_ROW_ID}
      loading={isLoading}
      noRowsLabel={t('reports.regions.empty')}
      defaultPageSize={REPORT_SCORECARD_PAGE_SIZE}
      pageSizeOptions={[REPORT_SCORECARD_PAGE_SIZE]}
    />
  );
};

export default RegionScorecardTable;
