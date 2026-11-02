'use client';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CustomAvatar from '@/@core/components/mui/avatar';
import {getInitials} from '@/@core/utils/userUtils';
import CardRow from '@/shared/components/common/CardRow';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  CaregiverPatientWorkload,
  CaregiverWorkloadStatus,
} from '@/shared/interfaces/caregiverChecklist';
import {Patient} from '@/shared/interfaces/patient';
import {getWorkloadLine} from '@/shared/utils/caregiverChecklists';
import {getFullName} from '@/shared/utils/general';
import {buildPatientIdentityLine} from '@/shared/utils/patientUtils';

interface Props {
  patient: Patient;
  workload?: CaregiverPatientWorkload;
  workloadStatus?: CaregiverWorkloadStatus;
  onRetryWorkload?: () => void;
  isFirst: boolean;
}

/**
 * One patient on the caregiver's phone, with the one line that says whether
 * she needs a visit today. The same row the desktop table shows, folded.
 */
const PatientRow = ({
  patient,
  workload,
  workloadStatus = 'ready',
  onRetryWorkload,
  isFirst,
}: Props) => {
  const {t} = useTranslation();

  const name = getFullName({
    firstName: patient.firstName,
    lastName: patient.lastName,
    lastFirst: true,
  });

  const identityLine = buildPatientIdentityLine({
    patient,
    parts: ['age', 'gender'],
  });

  const isWorkloadReady = workloadStatus === 'ready';

  // Until the checklists have loaded, a patient is not "nothing due".
  const {text: statusLine, isLate} = isWorkloadReady
    ? getWorkloadLine({workload, t})
    : {
        isLate: false,
        text: t(
          workloadStatus === 'loading'
            ? 'caregiverPortal.patients.workloadLoading'
            : 'caregiverPortal.patients.workloadError'
        ),
      };

  return (
    <CardRow
      href={DASHBOARD_ROUTES.patients.single({id: patient.id})}
      isFirst={isFirst}
      leading={
        <CustomAvatar
          src={patient.avatar}
          skin='light'
          color={patient.avatarColor}
          sx={{
            width: 42,
            height: 42,
            flex: 'none',
            fontSize: '0.875rem',
            fontWeight: 700,
          }}
        >
          {getInitials({name})}
        </CustomAvatar>
      }
      trailing={
        workloadStatus === 'error' && onRetryWorkload ? (
          <Button
            size='small'
            onClick={(event) => {
              event.preventDefault();
              onRetryWorkload();
            }}
            sx={{flex: 'none'}}
          >
            {t('caregiverPortal.error.retry')}
          </Button>
        ) : isLate ? (
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'error.main',
              flex: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {t('caregiverPortal.patients.lateChip')}
          </Typography>
        ) : (
          <Icon
            icon='mdi:chevron-right'
            fontSize={18}
            color='var(--mui-palette-customColors-inkFaint)'
          />
        )
      }
    >
      <Typography noWrap sx={{fontSize: '0.96875rem', fontWeight: 600}}>
        {name}
      </Typography>

      {identityLine && (
        <Typography
          noWrap
          sx={{fontSize: '0.78125rem', color: 'text.disabled', mt: 0.25}}
        >
          {identityLine}
        </Typography>
      )}

      <Typography
        noWrap
        sx={{fontSize: '0.78125rem', color: 'text.secondary', mt: 0.5}}
      >
        {statusLine}
      </Typography>
    </CardRow>
  );
};

export default PatientRow;
