'use client';

import Typography from '@mui/material/Typography';

import Link from '@/shared/components/common/localeLink';
import {
  NEEDS_ME_NOW_PARAMS,
  NURSE_OPEN_ALERTS_HREF,
} from '@/shared/constants/nurseDashboard';
import useTranslation from '@/shared/hooks/useTranslation';
import {useQueries as useAssessmentQueries} from '@/shared/reactQuery/assessments/queries';
import {transformRedFlagResponse} from '@/shared/utils/redFlagUtils';
import EmergencyFlagsTableUI from '@/views/pages/emergencyFlags/EmergencyFlagsTable/EmergencyFlagsTableUI';

// Open alerts on the nurse's patients, newest first. The API scopes the list
// to the nurse's regions.
const NeedsMeNowTable = () => {
  const {t} = useTranslation();
  const {useFetchEmergencyFlagsList} = useAssessmentQueries();

  const {data, isLoading, isError} = useFetchEmergencyFlagsList({
    params: NEEDS_ME_NOW_PARAMS,
  });

  const emergencyFlags = (data?.emergencyFlags ?? []).map((redFlag) =>
    transformRedFlagResponse({redFlag})
  );

  return (
    <EmergencyFlagsTableUI
      emergencyFlags={emergencyFlags}
      isLoading={isLoading}
      title={t('dashboard.nurseDashboard.needsMeNow.title')}
      noRowsLabel={t(
        isError
          ? 'dashboard.nurseDashboard.needsMeNow.error'
          : 'dashboard.nurseDashboard.needsMeNow.empty'
      )}
      titleInCard
      compact
      titleAction={
        <Typography
          component={Link}
          href={NURSE_OPEN_ALERTS_HREF}
          variant='small'
          sx={{fontWeight: 600, color: 'primary.main'}}
        >
          {t('dashboard.nurseDashboard.needsMeNow.action')} &rarr;
        </Typography>
      }
    />
  );
};

export default NeedsMeNowTable;
