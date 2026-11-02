'use client';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import useTranslation from '@/shared/hooks/useTranslation';
import {
  CaregiverPatientWorkload,
  CaregiverWorkloadStatus,
} from '@/shared/interfaces/caregiverChecklist';
import {getWorkloadLine} from '@/shared/utils/caregiverChecklists';

interface Props {
  workload?: CaregiverPatientWorkload;
  workloadStatus?: CaregiverWorkloadStatus;
  onRetryWorkload?: () => void;
}

/**
 * What one patient owes the signed-in caregiver today. Reads the same workload
 * the phone list reads, so the two screens cannot say different things. While
 * the checklists are still loading, or failed to load, it says that instead
 * of "nothing due".
 */
const PatientNextDueCell = ({
  workload,
  workloadStatus = 'ready',
  onRetryWorkload,
}: Props) => {
  const {t} = useTranslation();

  if (workloadStatus === 'loading') {
    return (
      <Typography noWrap variant='body' sx={{color: 'text.disabled'}}>
        {t('caregiverPortal.patients.workloadLoading')}
      </Typography>
    );
  }

  if (workloadStatus === 'error') {
    return (
      <Typography noWrap variant='body' sx={{color: 'text.secondary'}}>
        {t('caregiverPortal.patients.workloadError')}
        {onRetryWorkload && (
          <Button size='small' onClick={onRetryWorkload} sx={{ml: 1}}>
            {t('caregiverPortal.error.retry')}
          </Button>
        )}
      </Typography>
    );
  }

  const {text, isLate} = getWorkloadLine({workload, t});

  if (isLate) {
    return (
      <Typography noWrap variant='bodyStrong' sx={{color: 'error.main'}}>
        {text}
      </Typography>
    );
  }

  return (
    <Typography noWrap variant='body' sx={{color: 'text.secondary'}}>
      {text}
    </Typography>
  );
};

export default PatientNextDueCell;
