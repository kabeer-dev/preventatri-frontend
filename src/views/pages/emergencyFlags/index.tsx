'use client';

import Box from '@mui/material/Box';

import AlertSummaryCards from '@/shared/components/common/alertSummary';
import {ALERT_SUMMARY_CARDS} from '@/shared/constants/alertSummary';
import useUserRole from '@/shared/hooks/useUserRole';
import {patientQueries} from '@/shared/reactQuery';

import EmergencyFlagsTable from './EmergencyFlagsTable';

// The caregiver never reaches this page: her red flags are on Activity, and
// the route guard forwards her there.
const EmergencyFlagsPage = () => {
  const {isCaregiver} = useUserRole();

  const {useFetchPatientStats} = patientQueries();
  const {data, isLoading} = useFetchPatientStats({enabled: !isCaregiver});

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
      {!isCaregiver && (
        <AlertSummaryCards
          cards={ALERT_SUMMARY_CARDS}
          counts={data?.stats}
          isLoading={isLoading}
        />
      )}
      <EmergencyFlagsTable />
    </Box>
  );
};

export default EmergencyFlagsPage;
