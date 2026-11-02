'use client';

import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import StatsCard from '@/shared/components/common/StatsCard';
import {
  DASHBOARD_STATS_GRID_SPACING,
  DASHBOARD_STATS_ICON_SIZE,
} from '@/shared/constants/dashboard';
import {SKELETON_TEXT_WIDTH} from '@/shared/constants/skeletons';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  DashboardStatsGridProps,
  DashboardStatSubtitleArgs,
} from '@/shared/interfaces/dashboard';
import {formatStatValue} from '@/shared/utils/dashboardStats';

// One responsive grid of stat cards, shared by every role dashboard. Give it a
// role's stat config (`items`), its column span (`size`), and the fetched stat
// `values`; TStatKey is inferred from `items` so `values` stays type-checked.
const DashboardStatsGrid = <TStatKey extends string = string>({
  items,
  size,
  values,
  subtitleParams,
  isLoading = false,
}: DashboardStatsGridProps<TStatKey>) => {
  const {t} = useTranslation();

  const getSubtitle = ({
    subtitleKey,
    hasSubtitleParams,
    params,
  }: DashboardStatSubtitleArgs) => {
    if (!subtitleKey || (hasSubtitleParams && !params)) return undefined;

    return params ? t(subtitleKey, {replace: params}) : t(subtitleKey);
  };

  // height 100% lets a nested grid (e.g. the SLA cards beside the gauge)
  // stretch its cards to the sibling widget's height; resolves to `auto`
  // when the parent has no fixed height, so top-level rows are unaffected.
  return (
    <Grid
      container
      spacing={DASHBOARD_STATS_GRID_SPACING}
      sx={{height: '100%'}}
    >
      {items.map(
        ({
          statKey,
          icon: Icon,
          severity,
          color,
          titleKey,
          subtitleKey,
          hasSubtitleParams,
          format,
          tinted,
          href,
          drillLabelKey,
        }) => (
          <Grid size={size} key={statKey}>
            <StatsCard
              title={t(titleKey)}
              icon={Icon && <Icon size={DASHBOARD_STATS_ICON_SIZE} />}
              severity={severity}
              stats={
                isLoading ? (
                  <Skeleton width={SKELETON_TEXT_WIDTH.sm} />
                ) : (
                  formatStatValue({value: values?.[statKey], format})
                )
              }
              subtitle={getSubtitle({
                subtitleKey,
                hasSubtitleParams,
                params: subtitleParams?.[statKey],
              })}
              color={color}
              tinted={tinted}
              href={href}
              drillLabel={t(drillLabelKey || 'dashboard.stats.viewAll')}
            />
          </Grid>
        )
      )}
    </Grid>
  );
};

export default DashboardStatsGrid;
