'use client';

import CustomChip from '@/@core/components/mui/chip';
import RecordHeading from '@/shared/components/common/headers/RecordHeading';
import useTranslation from '@/shared/hooks/useTranslation';
import {Patient} from '@/shared/interfaces/patient';
import {getPatientStatusConfig} from '@/shared/utils/patientUtils';

interface Props {
  patient: Patient;

  /**
   * The office's status chip belongs to the record card, so the caregiver's
   * heading names the patient once and nothing else.
   */
  showStatus?: boolean;
  backHref: string;
}

/**
 * How a patient record names itself: a link back to the list, name and status.
 * The office page hangs it in the top bar and the caregiver's phone renders it
 * at the top of the page, both from here so they say the same thing.
 */
const PatientRecordHeading = ({
  patient,
  showStatus = true,
  backHref,
}: Props) => {
  const {t} = useTranslation();

  const statusConfig = getPatientStatusConfig({patient});

  return (
    <RecordHeading
      crumb={t('patients.backToList')}
      crumbHref={backHref}
      name={`${patient.firstName} ${patient.lastName}`}
      avatar={patient.avatar}
      avatarColor={patient.avatarColor}
      status={
        showStatus && (
          <CustomChip
            skin='light'
            size='small'
            label={statusConfig.label}
            color={statusConfig.color}
          />
        )
      }
    />
  );
};

export default PatientRecordHeading;
