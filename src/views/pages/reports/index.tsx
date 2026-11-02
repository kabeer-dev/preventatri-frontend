'use client';

import Box from '@mui/material/Box';

import SectionHeading from '@/shared/components/common/headers/SectionHeading';
import NowTag from '@/shared/components/common/NowTag';
import FlagsRaisedChart from '@/shared/components/pages/dashboard/FlagsRaisedChart';
import SlaComplianceChart from '@/shared/components/pages/dashboard/SlaComplianceChart';
import {useReportFilters} from '@/shared/hooks/useReportFilters';
import useTranslation from '@/shared/hooks/useTranslation';
import {reportQueries} from '@/shared/reactQuery';

import AlertStatusCard from './AlertStatusCard';
import CoverageGapsCard from './CoverageGapsCard';
import FollowUpTasksCard from './FollowUpTasksCard';
import HighRiskPatientsTable from './HighRiskPatientsTable';
import RegionScorecardTable from './RegionScorecardTable';
import ReportExportMenu from './ReportExportMenu';
import ReportKpiRow from './ReportKpiRow';
import ReportsToolbar from './ReportsToolbar';
import RolePerformanceCard from './RolePerformanceCard';
import SupervisoryVisitsCard from './SupervisoryVisitsCard';

const ReportsPage = () => {
  const {t} = useTranslation();

  const {range, filters, apiParams, coverageParams, toolbarFilters, setRange} =
    useReportFilters();

  const {useFetchReportOverview} = reportQueries();

  const {
    data: overview,
    dataUpdatedAt,
    isLoading,
    isError,
    refetch,
  } = useFetchReportOverview({params: apiParams});

  return (
    <Box className='flex flex-col gap-3.5'>
      <ReportExportMenu
        params={apiParams}
        coverageParams={coverageParams}
        filterFields={toolbarFilters.fields}
      />

      <ReportsToolbar
        range={range}
        updatedAt={dataUpdatedAt}
        onRangeChange={setRange}
        filters={toolbarFilters}
      />

      <ReportKpiRow
        overview={overview}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />

      <SectionHeading title={t('reports.sections.performance')} />

      <Box className='grid grid-cols-1 gap-3.5 lg:grid-cols-2'>
        <FlagsRaisedChart range={range} filters={filters} />
        <SlaComplianceChart range={range} filters={filters} />
        <RolePerformanceCard
          overview={overview}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <AlertStatusCard
          overview={overview}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
      </Box>

      <RegionScorecardTable params={apiParams} />

      <SectionHeading title={t('reports.sections.patients')} />

      <HighRiskPatientsTable params={apiParams} />

      <SectionHeading title={t('reports.sections.workItems')} />

      <Box className='grid grid-cols-1 gap-3.5 lg:grid-cols-2'>
        <FollowUpTasksCard params={apiParams} />
        <SupervisoryVisitsCard params={apiParams} />
      </Box>

      <SectionHeading
        title={t('reports.sections.coverage')}
        meta={<NowTag />}
      />

      <CoverageGapsCard params={coverageParams} />
    </Box>
  );
};

export default ReportsPage;
