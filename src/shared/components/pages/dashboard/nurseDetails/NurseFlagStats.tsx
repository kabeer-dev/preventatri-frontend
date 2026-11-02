'use client';

import Grid from '@mui/material/Grid';

import StatsCard from '@/shared/components/common/StatsCard';
import useTranslation from '@/shared/hooks/useTranslation';

export default function NurseFlagStats() {
  const {t} = useTranslation();

  return (
    <Grid container spacing={3.5} sx={{mb: 3.5}}>
      <Grid size={{xs: 12, sm: 4}}>
        <StatsCard
          title={t('nurse.details.redFlags')}
          stats={'N/A'}
          severity='critical'
          subtitle='Active'
        />
      </Grid>
      <Grid size={{xs: 12, sm: 4}}>
        <StatsCard
          title={t('nurse.details.yellowFlags')}
          stats={'N/A'}
          severity='moderate'
          subtitle='Active'
        />
      </Grid>
      <Grid size={{xs: 12, sm: 4}}>
        <StatsCard
          title={t('nurse.details.greenFlags')}
          stats={'N/A'}
          severity='stable'
          subtitle='Active'
        />
      </Grid>
    </Grid>
  );
}
