'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Loader from '@/shared/components/common/loaders/Loader';
import {
  HHA_SYNC_PATIENT_KIND,
  HHA_SYNC_WAITING_PATIENTS_LIMIT,
  HHA_SYNC_WAITING_PATIENTS_MAX_HEIGHT,
} from '@/shared/constants/hhaSyncHistory';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  HhaSyncWaitingPatientsProps,
  HhaWaitingPatient,
} from '@/shared/interfaces/hhaSyncHistory';
import {hhaExchangeQueries} from '@/shared/reactQuery';
import HhaSyncRecordLink from '@/views/pages/hhaSync/HhaSyncRecordLink';

const KEY = 'hhaSyncHistory.exceptions.waiting';

// The patients waiting for the person this exception names. Each one opens the
// patient, where an admin can put someone else on it meanwhile.
const HhaSyncWaitingPatients = ({exception}: HhaSyncWaitingPatientsProps) => {
  const {t} = useTranslation();
  const {useFetchHhaWaitingPatientsList} = hhaExchangeQueries();

  const {data, isLoading} = useFetchHhaWaitingPatientsList({
    id: exception.id,
    params: {limit: HHA_SYNC_WAITING_PATIENTS_LIMIT},
  });

  const patients: HhaWaitingPatient[] = data?.waitingPatients || [];

  // The row already knows the count, so the heading is right while the list loads.
  const total: number =
    data?.meta?.count ?? exception.waitingPatientCount ?? patients.length;

  return (
    <Box className='flex flex-col gap-2'>
      <Typography variant='subtitle2'>
        {t(`${KEY}.title`, {count: `${total}`})}
      </Typography>

      {isLoading && <Loader size={24} />}

      {!isLoading && patients.length === 0 && (
        <Typography variant='body2' sx={{color: 'text.secondary'}}>
          {t(`${KEY}.empty`)}
        </Typography>
      )}

      <Box
        className='flex flex-col gap-2 overflow-y-auto pr-2'
        sx={{maxHeight: HHA_SYNC_WAITING_PATIENTS_MAX_HEIGHT}}
      >
        {patients.map((patient) => (
          <Box
            key={patient.patientId}
            className='flex items-center justify-between gap-4'
          >
            <HhaSyncRecordLink
              record={{
                kind: HHA_SYNC_PATIENT_KIND,
                id: patient.patientId,
                name: patient.name,
              }}
              fallback={patient.name}
            />
            <Typography noWrap variant='small' sx={{color: 'text.disabled'}}>
              {patient.current
                ? t(`${KEY}.current`, {name: patient.current.name})
                : t(`${KEY}.nobody`)}
            </Typography>
          </Box>
        ))}
      </Box>

      {!isLoading && total > patients.length && (
        <Typography variant='small' sx={{color: 'text.disabled'}}>
          {t(`${KEY}.more`, {count: `${total - patients.length}`})}
        </Typography>
      )}
    </Box>
  );
};

export default HhaSyncWaitingPatients;
