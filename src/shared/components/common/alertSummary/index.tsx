'use client';

import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import {STATS_FALLBACK} from '@/shared/constants/common';
import {SKELETON_TEXT_WIDTH} from '@/shared/constants/skeletons';
import useTranslation from '@/shared/hooks/useTranslation';
import {AlertSummaryCardsProps} from '@/shared/interfaces/alertSummary';

import AlertSummaryCard from './AlertSummaryCard';

const AlertSummaryCards = ({
  cards,
  counts,
  isLoading,
}: AlertSummaryCardsProps) => {
  const {t} = useTranslation();

  return (
    <Grid container spacing={3}>
      {cards.map(
        ({
          id,
          labelKey,
          scopeKey,
          countKey,
          fallbackCountKey,
          formatValue,
          ...tone
        }) => {
          const count =
            counts?.[countKey] ??
            (fallbackCountKey ? counts?.[fallbackCountKey] : undefined);

          const resolvedValue =
            typeof count === 'number'
              ? (formatValue?.({value: count}) ?? count)
              : STATS_FALLBACK;

          const value = isLoading ? (
            <Skeleton width={SKELETON_TEXT_WIDTH.sm} />
          ) : (
            resolvedValue
          );

          return (
            <Grid key={id} size={{xs: 12, sm: 6, lg: 3}}>
              <AlertSummaryCard
                label={t(labelKey)}
                scope={t(scopeKey)}
                value={value}
                {...tone}
              />
            </Grid>
          );
        }
      )}
    </Grid>
  );
};

export default AlertSummaryCards;
