'use client';

import {MouseEvent, useState} from 'react';

import {Icon} from '@iconify/react';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import {layout} from '@/@core/theme/spacing';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {FLAGS_RAISED_TIERS} from '@/shared/constants/adminDashboard';
import {
  DASHBOARD_EXPORT_FORMATS,
  DASHBOARD_STAT_EMPTY_PLACEHOLDER,
  TREND_RANGE_LABEL_FORMAT,
} from '@/shared/constants/dashboard';
import {DATA_EXPORT_TYPES} from '@/shared/constants/dataExport';
import {FILTER_PARAMS} from '@/shared/constants/general';
import {
  REPORT_ALERT_STATUSES,
  REPORT_COVERAGE_GAPS,
  REPORT_EXPORT,
  REPORT_FOLLOW_UP_CHART,
  REPORT_KPI_TILES,
  REPORT_PATIENT_TRENDS,
  REPORT_ROLES,
  REPORT_TOOLBAR,
  REPORT_UNASSIGNED_REGION_KEY,
  REPORT_VISIT_STATUS_MIX,
} from '@/shared/constants/reports';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  DashboardExportFormat,
  DashboardExportTable,
} from '@/shared/interfaces/dashboard';
import {ReportExportMenuProps} from '@/shared/interfaces/reports';
import {auditLogMutations, reportQueries} from '@/shared/reactQuery';
import {useQueries as dashboardQueries} from '@/shared/reactQuery/dashboard/queries';
import {exportDashboardData} from '@/shared/utils/dashboardExport';
import {
  formatDate,
  formatDateRangeLabel,
  formatMillis,
} from '@/shared/utils/dateUtils';
import {
  buildDeltaLabel,
  buildKpiTileValues,
  formatReportCount,
  formatReportDuration,
  formatReportPercent,
  formatReportValue,
} from '@/shared/utils/reportFormat';
import {showToast} from '@/shared/utils/toasts';

const ReportExportMenu = ({
  params,
  coverageParams,
  filterFields,
}: ReportExportMenuProps) => {
  const {t} = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Counts, not names: a reloaded page knows the ids but not every name.
  const personCounts = filterFields.flatMap((field) => {
    const countKey = REPORT_EXPORT.personCountKeys[field.param];

    return countKey && field.values.length
      ? [t(countKey, {count: field.values.length})]
      : [];
  });

  const filterSummary = personCounts.length
    ? t('reports.export.selected', {
        filters:
          personCounts.length > 1
            ? t('reports.export.listAnd', {
                rest: personCounts.slice(0, -1).join(', '),
                last: personCounts[personCounts.length - 1],
              })
            : personCounts[0],
      })
    : '';

  const {
    useFetchReportOverview,
    useFetchReportRegions,
    useFetchReportHighRiskPatients,
    useFetchReportWorkItems,
    useFetchReportCoverage,
  } = reportQueries();

  const {useFetchAdminDashboardStatsTrends} = dashboardQueries();
  const {useLogDataExportMutation} = auditLogMutations();
  const {mutate: logDataExport} = useLogDataExportMutation();

  const overviewQuery = useFetchReportOverview({
    params,
    ...REPORT_EXPORT.cacheOnly,
  });

  const regionsQuery = useFetchReportRegions({
    params,
    ...REPORT_EXPORT.cacheOnly,
  });

  const patientsQuery = useFetchReportHighRiskPatients({
    params,
    ...REPORT_EXPORT.cacheOnly,
  });

  const workItemsQuery = useFetchReportWorkItems({
    params,
    ...REPORT_EXPORT.cacheOnly,
  });

  const coverageQuery = useFetchReportCoverage({
    params: coverageParams,
    ...REPORT_EXPORT.cacheOnly,
  });

  const trendsQuery = useFetchAdminDashboardStatsTrends({
    params,
    ...REPORT_EXPORT.cacheOnly,
  });

  const overview = overviewQuery.data;
  const regionsReport = regionsQuery.data;
  const patientsReport = patientsQuery.data;
  const workItems = workItemsQuery.data;
  const coverage = coverageQuery.data;
  const trendsData = trendsQuery.data;

  // Every section must hold data for the current filters (or have failed), so
  // a file never mixes in the previous period or region.
  const isExportReady =
    Boolean(overview) &&
    [
      overviewQuery,
      regionsQuery,
      patientsQuery,
      workItemsQuery,
      coverageQuery,
      trendsQuery,
    ].every(
      (query) => !query.isPlaceholderData && (query.data || query.isError)
    );

  const periodLabel = formatDateRangeLabel({
    range: params,
    sameYearStartFormat: TREND_RANGE_LABEL_FORMAT.sameYearStart,
    fullFormat: TREND_RANGE_LABEL_FORMAT.full,
  });

  // An applied region the list cannot name (still loading, or inactive) must
  // not read as "All regions".
  const regionName =
    filterFields
      .find((field) => field.param === FILTER_PARAMS.region)
      ?.options.find((option) => option.value === params.regionId)?.label ??
    t(params.regionId ? 'reports.export.unnamedRegion' : 'reports.allRegions');

  const figuresHead = [
    t('reports.export.headers.metric'),
    t('reports.export.headers.value'),
  ];

  const buildPatientsTable = (): DashboardExportTable => ({
    title: t('reports.patients.title'),
    head: [
      t('reports.patients.headers.patient'),
      t('reports.patients.headers.county'),
      t('reports.patients.headers.caseManager'),
      t('reports.patients.headers.red'),
      t('reports.patients.headers.yellow'),
      t('reports.patients.headers.overdue'),
      t('reports.patients.headers.trend'),
    ],
    body: (patientsReport?.patients ?? []).map((patient) => [
      t('reports.patients.name', {
        firstName: patient.firstName,
        lastName: patient.lastName,
      }),
      patient.countyName ?? t('reports.patients.noCounty'),
      patient.caseManager
        ? t('reports.patients.caseManagerName', {
            firstName: patient.caseManager.firstName,
            lastName: patient.caseManager.lastName,
          })
        : t('reports.patients.unassigned'),
      formatReportCount({value: patient.redAlerts}),
      formatReportCount({value: patient.yellowAlerts}),
      formatReportCount({value: patient.overdueFollowUps}),
      patient.trend ? t(REPORT_PATIENT_TRENDS[patient.trend].labelKey) : '',
    ]),
  });

  const buildKpisTable = (): DashboardExportTable[] => {
    if (!overview) return [];

    return [
      {
        title: t('reports.export.tables.kpis'),
        head: [
          t('reports.export.headers.metric'),
          t('reports.export.headers.value'),
          t('reports.export.headers.change'),
          t('reports.export.headers.details'),
        ],
        body: REPORT_KPI_TILES.map((config) => {
          const {value, delta, subtitleParams} = buildKpiTileValues({
            config,
            overview,
          });

          // PDF fonts lack the arrow glyphs, so the change reads as a sign.
          const deltaLabel = buildDeltaLabel({delta, format: config.format});

          const change =
            deltaLabel && delta
              ? t(deltaLabel.labelKey, {
                  ...deltaLabel.params,
                  arrow: delta > 0 ? '+' : '-',
                })
              : DASHBOARD_STAT_EMPTY_PLACEHOLDER;

          const title = config.isLive
            ? `${t(config.titleKey)} (${t('reports.now')})`
            : t(config.titleKey);

          return [
            title,
            formatReportValue({value, format: config.format}),
            change,
            t(config.subtitleKey, subtitleParams),
          ];
        }),
      },
      {
        title: t('reports.roles.title'),
        head: [
          t('reports.export.headers.role'),
          t('reports.export.headers.measure'),
          t('reports.export.headers.result'),
        ],
        body: REPORT_ROLES.map((config) => {
          const {pct, part, total, people} = overview.roles[config.key];

          return [
            t('reports.roles.nameWithPeople', {
              name: t(config.labelKey),
              people: formatReportCount({value: people}),
            }),
            t(config.measureKey, {part, total}),
            formatReportPercent({value: pct}),
          ];
        }),
      },
      {
        title: t('reports.export.tables.alertStatus'),
        head: [
          t('reports.export.headers.status'),
          t('reports.export.headers.count'),
        ],
        body: REPORT_ALERT_STATUSES.map(({key, labelKey}) => [
          t(labelKey),
          formatReportCount({value: overview.alertStatus[key]}),
        ]),
      },
    ];
  };

  const buildFlagsTable = (): DashboardExportTable[] => {
    const trends = trendsData?.trends;

    if (!trends) return [];

    return [
      {
        title: t('reports.export.tables.flagsPerDay'),
        head: [t('reports.export.headers.date')].concat(
          FLAGS_RAISED_TIERS.map(({labelKey}) => t(labelKey))
        ),
        body: trends.labels.map((label, index) =>
          [
            formatDate({date: label, format: TREND_RANGE_LABEL_FORMAT.full}),
          ].concat(
            FLAGS_RAISED_TIERS.map(({seriesKey}) =>
              formatReportCount({
                value: trends.flagsRaised[seriesKey][index] ?? 0,
              })
            )
          )
        ),
      },
      {
        title: t('reports.export.tables.slaPerDay'),
        head: [
          t('reports.export.headers.date'),
          t('dashboard.adminDashboard.slaCompliance.title'),
        ],
        body: trends.labels.map((label, index) => [
          formatDate({date: label, format: TREND_RANGE_LABEL_FORMAT.full}),
          formatReportPercent({
            value: trends.slaCompliance.daily[index] ?? null,
          }),
        ]),
      },
    ];
  };

  const buildScorecardTable = (): DashboardExportTable[] => {
    if (!regionsReport) return [];

    return [
      {
        title: t('reports.regions.title'),
        head: [
          t('reports.regions.headers.region'),
          t('reports.regions.headers.activePatients'),
          t('reports.regions.headers.alerts'),
          t('reports.regions.headers.sla'),
          t('reports.regions.headers.medianResolve'),
          t('reports.regions.headers.assessments'),
          t('reports.regions.headers.overdue'),
        ],
        body: regionsReport.regions.map((row) => [
          row.regionName ?? t(REPORT_UNASSIGNED_REGION_KEY),
          formatReportCount({value: row.activePatients}),
          formatReportCount({value: row.alerts}),
          formatReportPercent({value: row.slaCompliancePct}),
          formatReportDuration({seconds: row.medianResolveSeconds}),
          formatReportPercent({value: row.assessmentsOnTimePct}),
          formatReportCount({value: row.overdueNow}),
        ]),
      },
    ];
  };

  const buildWorkItemsTables = (): DashboardExportTable[] => {
    if (!workItems) return [];

    const {followUps, visits} = workItems;
    const nowSuffix = ` (${t('reports.now')})`;

    return [
      {
        title: t('reports.followUps.title'),
        head: figuresHead,
        body: [
          [
            t('reports.followUps.created'),
            formatReportCount({value: followUps.created}),
          ],
          [
            t('reports.followUps.completed'),
            formatReportCount({value: followUps.completed}),
          ],
          [
            t('reports.followUps.onTime'),
            formatReportPercent({value: followUps.completedOnTimePct}),
          ],
          [
            t('reports.followUps.overdue') + nowSuffix,
            formatReportCount({value: followUps.overdueNow}),
          ],
        ],
      },
      {
        title: t('reports.export.tables.followUpsPerPeriod'),
        head: [
          t('reports.export.headers.period'),
          t('reports.followUps.created'),
          t('reports.followUps.completed'),
        ],
        body: followUps.trend.buckets.map(({key}, index) => [
          formatDate({
            date: key,
            format: REPORT_FOLLOW_UP_CHART.bucketLabelFormat,
          }),
          formatReportCount({value: followUps.trend.created[index] ?? 0}),
          formatReportCount({value: followUps.trend.completed[index] ?? 0}),
        ]),
      },
      {
        title: t('reports.visits.title'),
        head: figuresHead,
        body: [
          [
            t('reports.visits.scheduled'),
            formatReportCount({value: visits.scheduled}),
          ],
          [
            t('reports.visits.filedOnTime'),
            formatReportPercent({value: visits.filedOnTimePct}),
          ],
          [
            t('reports.visits.medianReview'),
            formatReportDuration({seconds: visits.medianReviewSeconds}),
          ],
          [
            t('reports.visits.overdue') + nowSuffix,
            formatReportCount({value: visits.overdueNow}),
          ],
          [
            t('reports.visits.concerns'),
            t('reports.visits.concernsValue', {
              count: visits.concernsNoted,
              filed: visits.filed,
            }),
          ],
          [
            t('reports.visits.corrections'),
            formatReportCount({value: visits.correctionRequested}),
          ],
        ],
      },
      {
        title: t('reports.export.tables.visitStatus'),
        head: [
          t('reports.export.headers.status'),
          t('reports.export.headers.count'),
        ],
        body: visits.statusMix.map(({status, count}) => [
          t(REPORT_VISIT_STATUS_MIX[status].labelKey),
          formatReportCount({value: count}),
        ]),
      },
    ];
  };

  const buildCoverageTable = (): DashboardExportTable[] => {
    if (!coverage) return [];

    const scopeNotes = [t('reports.now')].concat(
      filterSummary ? [t('reports.export.tables.regionOnly')] : []
    );

    return [
      {
        title: `${t('reports.coverage.title')} (${scopeNotes.join(', ')})`,
        head: [
          t('reports.export.headers.gap'),
          t('reports.export.headers.count'),
          t('reports.export.headers.reason'),
        ],
        body: REPORT_COVERAGE_GAPS.flatMap(({key, titleKey, reasonKey}) => {
          const count = coverage.gaps[key];

          return count === null
            ? []
            : [[t(titleKey), formatReportCount({value: count}), t(reasonKey)]];
        }),
      },
    ];
  };

  const handleExport = ({format}: {format: DashboardExportFormat}) => {
    setAnchorEl(null);

    const tables = [
      ...buildKpisTable(),
      ...buildFlagsTable(),
      ...buildScorecardTable(),
      ...(patientsReport ? [buildPatientsTable()] : []),
      ...buildWorkItemsTables(),
      ...buildCoverageTable(),
    ];

    const baseTitle = t('reports.export.fileTitle', {
      period: periodLabel,
      region: regionName,
    });

    const title = filterSummary ? `${baseTitle}, ${filterSummary}` : baseTitle;

    exportDashboardData({
      format,
      title,
      subtitle: t('reports.export.generated', {
        date: formatMillis({
          millis: Date.now(),
          format: REPORT_TOOLBAR.updatedFormat,
        }),
      }),
      fileName: REPORT_EXPORT.pageFileName,
      tables,
    })
      .then(() =>
        // The file is built here, so the backend only knows about it if told.
        logDataExport({
          payload: {
            exportType: DATA_EXPORT_TYPES.REPORT,
            format: format.toUpperCase(),
            title,
            filters: params,
          },
        })
      )
      .catch(() =>
        showToast({type: 'error', message: t('reports.export.failed')})
      );
  };

  const isOpen = Boolean(anchorEl);

  return (
    <TopBarSlot side='right'>
      <Button
        variant='contained'
        disabled={!isExportReady}
        aria-haspopup='menu'
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'report-export-menu' : undefined}
        startIcon={
          <Icon
            icon={REPORT_EXPORT.buttonIcon}
            fontSize={layout.topBarActionIconSize}
          />
        }
        onClick={(event: MouseEvent<HTMLElement>) =>
          setAnchorEl(event.currentTarget)
        }
      >
        {t('reports.export.button')}
      </Button>

      <Menu
        id='report-export-menu'
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
      >
        <MenuItem
          onClick={() => handleExport({format: DASHBOARD_EXPORT_FORMATS.PDF})}
        >
          <ListItemText
            primary={t('reports.export.pdf')}
            secondary={t('reports.export.pdfHint')}
          />
        </MenuItem>
        <MenuItem
          onClick={() => handleExport({format: DASHBOARD_EXPORT_FORMATS.CSV})}
        >
          <ListItemText
            primary={t('reports.export.csv')}
            secondary={t('reports.export.csvHint')}
          />
        </MenuItem>
      </Menu>
    </TopBarSlot>
  );
};

export default ReportExportMenu;
