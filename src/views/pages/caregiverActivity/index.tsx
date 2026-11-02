'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import {parseAsInteger, parseAsString, useQueryStates} from 'nuqs';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import EmptyLine from '@/shared/components/common/EmptyLine';
import CardRowsSkeleton from '@/shared/components/common/skeletons/CardRowsSkeleton';
import {
  CAREGIVER_ACTIVITY_KINDS,
  CAREGIVER_ACTIVITY_PARAMS,
  CAREGIVER_ACTIVITY_RANGES,
  CAREGIVER_ALL_PATIENTS,
} from '@/shared/constants/caregiver';
import {WIDGET_SKELETONS} from '@/shared/constants/pageSkeletons';
import useCaregiverActivity from '@/shared/hooks/useCaregiverActivity';
import useCaregiverPatientOptions from '@/shared/hooks/useCaregiverPatientOptions';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useTranslation from '@/shared/hooks/useTranslation';

import ActivityFilters from './ActivityFilters';
import ActivityRow from './ActivityRow';

/**
 * C14 and W05: everything the caregiver sent and what came back, from the two
 * lists she already has. The same rows on both shells; only the row layout and
 * the page width change.
 */
const CaregiverActivityView = () => {
  const {t} = useTranslation();

  const isDesktop = useIsDesktop();

  const [filters, setFilters] = useQueryStates({
    [CAREGIVER_ACTIVITY_PARAMS.kind]: parseAsString.withDefault(
      CAREGIVER_ACTIVITY_KINDS.all
    ),
    [CAREGIVER_ACTIVITY_PARAMS.patient]: parseAsString.withDefault(
      CAREGIVER_ALL_PATIENTS
    ),
    [CAREGIVER_ACTIVITY_PARAMS.range]: parseAsInteger.withDefault(
      CAREGIVER_ACTIVITY_RANGES.week
    ),
  });

  const {patients} = useCaregiverPatientOptions();

  const {days, isLoading, isError, refetch} = useCaregiverActivity({
    filters: {
      kind: filters.kind,
      patient: filters.patient,
      range: filters.range,
    },
  });

  return (
    <Box>
      {!isDesktop && (
        <Typography
          sx={{fontSize: '0.875rem', color: 'text.secondary', mt: -3}}
        >
          {t('caregiverActivity.subtitle')}
        </Typography>
      )}

      <ActivityFilters
        kind={filters.kind}
        patient={filters.patient}
        range={filters.range}
        patients={patients}
        onKindChange={({value}) => setFilters({kind: value})}
        onPatientChange={({value}) => setFilters({patient: value})}
        onRangeChange={({value}) => setFilters({range: value})}
      />

      {isLoading && (
        <CardRowsSkeleton
          rows={WIDGET_SKELETONS.caregiverActivity.count}
          row={{lines: 2, trailing: 'chip'}}
          sx={{mt: 5.5}}
        />
      )}

      {!isLoading && isError && (
        <ContentNotAvailable
          title={t('caregiverPortal.error.title')}
          message={t('caregiverPortal.error.message')}
          onBack={() => refetch()}
          backButtonText={t('caregiverPortal.error.retry')}
        />
      )}

      {!isLoading && !isError && days.length === 0 && (
        <EmptyLine text={t('caregiverActivity.empty')} sx={{mt: 6, px: 1}} />
      )}

      {!isLoading &&
        !isError &&
        days.map((day) => (
          <Box key={day.key}>
            <Typography
              variant='eyebrow'
              component='h2'
              sx={{color: 'text.disabled', px: 1, pt: 5.5, pb: 2}}
            >
              {day.label}
            </Typography>

            <Card>
              {day.items.map((item, index) => (
                <ActivityRow
                  key={`${item.kind}-${item.id}`}
                  item={item}
                  isFirst={index === 0}
                  isDesktop={isDesktop}
                />
              ))}
            </Card>
          </Box>
        ))}
    </Box>
  );
};

export default CaregiverActivityView;
