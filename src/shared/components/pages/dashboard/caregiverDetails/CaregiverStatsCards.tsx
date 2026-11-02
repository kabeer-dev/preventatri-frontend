'use client';

import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import Icon from '@/@core/components/icon';
import StatsCard from '@/shared/components/common/StatsCard';
import {SKELETON_TEXT_WIDTH} from '@/shared/constants/skeletons';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverStatsCardsProps} from '@/shared/interfaces/caregiverDetails';

export default function CaregiverStatsCards({
  statistics,
  isStatsLoading,
}: CaregiverStatsCardsProps) {
  const {t} = useTranslation();

  return (
    <Grid container spacing={3.5} sx={{mb: 3.5}}>
      <Grid size={{xs: 12, sm: 6}}>
        <StatsCard
          title={t('caregiver.details.submittedChecklist')}
          stats={
            isStatsLoading ? (
              <Skeleton width={SKELETON_TEXT_WIDTH.sm} />
            ) : (
              (statistics?.submissionsCount ?? 'N/A')
            )
          }
          icon={<Icon icon='mdi:clipboard-text-outline' fontSize={24} />}
          color='primary'
          subtitle={t('caregiver.details.last30Days')}
        />
      </Grid>
      <Grid size={{xs: 12, sm: 6}}>
        <StatsCard
          title={t('caregiver.details.redFlagsRaised')}
          stats={
            isStatsLoading ? (
              <Skeleton width={SKELETON_TEXT_WIDTH.sm} />
            ) : (
              (statistics?.redFlagsCount ?? 'N/A')
            )
          }
          severity='critical'
          subtitle={t('caregiver.details.last30Days')}
        />
      </Grid>
    </Grid>
  );
}
