'use client';

import SentState from '@/shared/components/common/SentState';
import useTranslation from '@/shared/hooks/useTranslation';

interface Props {
  patientFirstName: string;
}

/**
 * C16, without the clock. The nurse's acknowledgment is not exposed to the
 * caregiver, so there is no countdown and no Call button: the flag is with the
 * nurse, and the caregiver stays with the patient.
 */
const RedFlagSentView = ({patientFirstName}: Props) => {
  const {t} = useTranslation();

  return (
    <SentState
      icon='mdi:flag-outline'
      color='error'
      align='start'
      title={t('caregiverRedFlag.sent.title')}
      lines={[t('caregiverRedFlag.sent.line', {patient: patientFirstName})]}
      sx={{py: 6}}
    />
  );
};

export default RedFlagSentView;
