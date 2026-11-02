'use client';

import {ALERT_QUEUE} from '@/shared/constants/dashboard';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import {UseAlertQueueParams} from '@/shared/interfaces/dashboard';
import {EmergencyFlagListItem} from '@/shared/interfaces/emergencyFlag';
import {useQueries as useAssessmentQueries} from '@/shared/reactQuery/assessments/queries';
import {transformRedFlagResponse} from '@/shared/utils/redFlagUtils';

const useAlertQueue = ({enabled}: UseAlertQueueParams = {}) => {
  const {useFetchEmergencyFlagsList} = useAssessmentQueries();

  const {data, isLoading} = useFetchEmergencyFlagsList({
    params: {page: 1, limit: ALERT_QUEUE.previewLimit, ...SUB_ROUTE_PARAMS},
    enabled,
  });

  const alerts: EmergencyFlagListItem[] = (data?.emergencyFlags ?? []).map(
    (emergencyFlag) => transformRedFlagResponse({redFlag: emergencyFlag})
  );

  return {alerts, isLoading};
};

export default useAlertQueue;
