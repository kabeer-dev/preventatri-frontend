import {
  DASHBOARD_STAT_EMPTY_PLACEHOLDER,
  DASHBOARD_STAT_FORMATS,
  DASHBOARD_STAT_PERCENT_SUFFIX,
} from '@/shared/constants/dashboard';
import {REPORT_DELTA} from '@/shared/constants/reports';
import {DashboardStatFormat} from '@/shared/interfaces/dashboard';
import {
  ReportDeltaLabel,
  ReportKpiTileConfig,
  ReportKpiTileValues,
  ReportOverviewResponse,
  ReportThreshold,
} from '@/shared/interfaces/reports';
import {
  ReportDeltaGoodWhen,
  ReportKpiKey,
  ReportSubtitleParams,
  ReportTone,
} from '@/shared/types/reports';
import {formatShortDuration} from '@/shared/utils/dateUtils';

export const toneFor = ({
  value,
  thresholds,
}: {
  value: number | null;
  thresholds?: ReportThreshold;
}): ReportTone => {
  if (value === null || !thresholds) return 'neutral';

  if (value >= thresholds.good) return 'good';

  return value >= thresholds.watch ? 'watch' : 'poor';
};

export const formatReportPercent = ({value}: {value: number | null}) =>
  value === null
    ? DASHBOARD_STAT_EMPTY_PLACEHOLDER
    : `${value.toFixed(1)}${DASHBOARD_STAT_PERCENT_SUFFIX}`;

export const formatReportDuration = ({seconds}: {seconds: number | null}) =>
  seconds === null
    ? DASHBOARD_STAT_EMPTY_PLACEHOLDER
    : formatShortDuration({seconds: Math.round(seconds)});

export const formatReportCount = ({value}: {value: number | null}) =>
  value === null ? DASHBOARD_STAT_EMPTY_PLACEHOLDER : value.toLocaleString();

export const formatReportValue = ({
  value,
  format,
}: {
  value: number | null;
  format: DashboardStatFormat;
}) => {
  if (format === DASHBOARD_STAT_FORMATS.PERCENT)
    return formatReportPercent({value});

  if (format === DASHBOARD_STAT_FORMATS.DURATION)
    return formatReportDuration({seconds: value});

  return formatReportCount({value});
};

export const deltaTone = ({
  delta,
  goodWhen,
}: {
  delta: number | null;
  goodWhen?: ReportDeltaGoodWhen;
}): ReportTone => {
  if (!delta || !goodWhen) return 'neutral';

  const isUp = delta > 0;

  return isUp === (goodWhen === 'up') ? 'good' : 'poor';
};

export const buildKpiTileValues = ({
  config,
  overview,
}: {
  config: ReportKpiTileConfig;
  overview: ReportOverviewResponse;
}): ReportKpiTileValues => {
  const {kpis, kpiDetails, overdueNow} = overview;

  const subtitleParams: Record<ReportKpiKey, ReportSubtitleParams> = {
    alertsRaised: {red: kpiDetails.red, yellow: kpiDetails.yellow},
    slaCompliancePct: {timeouts: kpiDetails.timeouts},
    medianResolveSeconds: {
      p90: formatReportDuration({seconds: kpiDetails.p90ResolveSeconds}),
      accept: formatReportDuration({seconds: kpiDetails.medianAcceptSeconds}),
    },
    assessmentsOnTimePct: {missed: kpiDetails.missed, late: kpiDetails.late},
    overdueWork: {tasks: overdueNow.tasks, visits: overdueNow.visits},
  };

  if (config.key === 'overdueWork')
    return {
      value: overdueNow.total,
      delta: null,
      subtitleParams: subtitleParams.overdueWork,
    };

  const {value, delta} = kpis[config.key];

  return {value, delta, subtitleParams: subtitleParams[config.key]};
};

// Null when there is no change to show. Percent changes read as points
// ("2.1 pts"), since both figures are already percentages.
export const buildDeltaLabel = ({
  delta,
  format,
}: {
  delta: number | null;
  format: DashboardStatFormat;
}): ReportDeltaLabel | null => {
  if (!delta) return null;

  const arrow = delta > 0 ? REPORT_DELTA.upArrow : REPORT_DELTA.downArrow;
  const size = Math.abs(delta);

  // A change that rounds to nothing is no change, not an arrow beside "0.0".
  if (format === DASHBOARD_STAT_FORMATS.PERCENT)
    return Number(size.toFixed(1))
      ? {
          labelKey: REPORT_DELTA.pointsLabelKey,
          params: {arrow, amount: size.toFixed(1)},
        }
      : null;

  const isDuration = format === DASHBOARD_STAT_FORMATS.DURATION;

  if (isDuration && !Math.round(size)) return null;

  const amount = isDuration
    ? formatShortDuration({seconds: Math.round(size)})
    : size.toLocaleString();

  return {labelKey: REPORT_DELTA.labelKey, params: {arrow, amount}};
};
