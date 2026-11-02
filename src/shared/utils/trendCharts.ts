import type {Theme} from '@mui/material/styles';
import type {ChartData, ChartOptions, ScriptableContext} from 'chart.js';

import {FLAGS_RAISED_TIERS} from '@/shared/constants/adminDashboard';
import {
  DASHBOARD_STAT_PERCENT_SUFFIX,
  STATISTICS_AXIS_DATE_FORMAT,
  TREND_CHART,
} from '@/shared/constants/dashboard';
import {AdminDashboardTrends} from '@/shared/interfaces/dashboard';
import {formatDate} from '@/shared/utils/dateUtils';

export const buildTooltipStyle = ({theme}: {theme: Theme}) => ({
  backgroundColor: theme.palette.background.paper,
  titleColor: theme.palette.text.primary,
  bodyColor: theme.palette.text.secondary,
  borderColor: theme.palette.divider,
  borderWidth: 1,
  usePointStyle: true,
  padding: TREND_CHART.tooltipPadding,
  boxPadding: TREND_CHART.tooltipBoxPadding,
});

// Chart.js renders at the screen ratio, which blurs on fractional scaling
// (for example 125%), so the canvas is drawn at no less than 2x.
const getTrendChartPixelRatio = () =>
  typeof window === 'undefined'
    ? TREND_CHART.minPixelRatio
    : Math.max(window.devicePixelRatio, TREND_CHART.minPixelRatio);

const formatTooltipDate = ({label}: {label?: string}) =>
  label ? formatDate({date: label, format: STATISTICS_AXIS_DATE_FORMAT}) : '';

export const buildFlagsRaisedChartData = ({
  trends,
  theme,
  translate,
}: {
  trends?: AdminDashboardTrends;
  theme: Theme;
  translate: (key: string) => string;
}): ChartData<'bar'> => {
  const labels = trends?.labels ?? [];
  const bottomToTopTiers = [...FLAGS_RAISED_TIERS].reverse();

  const valuesByTier = bottomToTopTiers.map(({seriesKey}) =>
    labels.map((_label, index) => trends?.flagsRaised[seriesKey][index] ?? 0)
  );

  const filledTierIndexesByDay = labels.map((_label, dayIndex) =>
    valuesByTier.flatMap((values, tierIndex) =>
      values[dayIndex] > 0 ? [tierIndex] : []
    )
  );

  const radius = TREND_CHART.barRadius;

  const datasets = bottomToTopTiers.map(({labelKey, colorKey}, tierIndex) => ({
    label: translate(labelKey),
    data: valuesByTier[tierIndex],
    backgroundColor: theme.palette.customColors[colorKey],
    borderColor: theme.palette.background.paper,
    borderSkipped: false as const,
    categoryPercentage: TREND_CHART.barCategoryPercentage,
    barPercentage: 1,
    borderRadius: (context: ScriptableContext<'bar'>) => {
      const filledTiers = filledTierIndexesByDay[context.dataIndex] ?? [];
      const isTop = filledTiers.at(-1) === tierIndex;
      const isBottom = filledTiers[0] === tierIndex;

      return {
        topLeft: isTop ? radius : 0,
        topRight: isTop ? radius : 0,
        bottomLeft: isBottom ? radius : 0,
        bottomRight: isBottom ? radius : 0,
      };
    },
    borderWidth: (context: ScriptableContext<'bar'>) => {
      const filledTiers = filledTierIndexesByDay[context.dataIndex] ?? [];
      const isTop = filledTiers.at(-1) === tierIndex;

      return {top: isTop ? 0 : TREND_CHART.barSegmentGap};
    },
  }));

  return {labels, datasets};
};

export const buildFlagsRaisedChartOptions = ({
  theme,
}: {
  theme: Theme;
}): ChartOptions<'bar'> => ({
  responsive: true,
  maintainAspectRatio: false,
  devicePixelRatio: getTrendChartPixelRatio(),
  layout: {
    padding: TREND_CHART.flagsRaisedPadding,
  },
  interaction: {mode: 'index', intersect: false},
  scales: {
    x: {stacked: true, display: false},
    y: {stacked: true, display: false, beginAtZero: true},
  },
  plugins: {
    legend: {display: false},
    tooltip: {
      ...buildTooltipStyle({theme}),
      itemSort: (first, second) => second.datasetIndex - first.datasetIndex,
      callbacks: {
        title: (items) => formatTooltipDate({label: items[0]?.label}),
      },
    },
  },
});

export const hasSlaComplianceSeries = ({
  trends,
}: {
  trends?: AdminDashboardTrends;
}): boolean =>
  Boolean(trends?.slaCompliance.daily.some((value) => value !== null));

export const buildSlaComplianceChartData = ({
  trends,
  theme,
  label,
}: {
  trends?: AdminDashboardTrends;
  theme: Theme;
  label: string;
}): ChartData<'line'> => ({
  labels: trends?.labels ?? [],
  datasets: [
    {
      label,

      // A day with no resolutions sits at 0; its tooltip says so.
      data: (trends?.slaCompliance.daily ?? []).map((value) => value ?? 0),
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.customColors.brandTint,
      borderWidth: TREND_CHART.lineWidth,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: theme.palette.primary.main,
      tension: 0,
      fill: 'origin',
      clip: false,
    },
  ],
});

export const buildSlaComplianceChartOptions = ({
  trends,
  theme,
  noResolutionsLabel,
}: {
  trends?: AdminDashboardTrends;
  theme: Theme;
  noResolutionsLabel: string;
}): ChartOptions<'line'> => ({
  responsive: true,
  maintainAspectRatio: false,
  devicePixelRatio: getTrendChartPixelRatio(),
  layout: {
    padding: TREND_CHART.slaCompliancePadding,
  },
  interaction: {mode: 'index', intersect: false},
  scales: {
    x: {display: false},
    y: {display: false, min: 0, max: 100},
  },
  plugins: {
    legend: {display: false},
    tooltip: {
      ...buildTooltipStyle({theme}),
      callbacks: {
        title: (items) => formatTooltipDate({label: items[0]?.label}),
        label: (item) =>
          trends?.slaCompliance.daily[item.dataIndex] === null
            ? noResolutionsLabel
            : `${item.formattedValue}${DASHBOARD_STAT_PERCENT_SUFFIX}`,
      },
    },
  },
});
