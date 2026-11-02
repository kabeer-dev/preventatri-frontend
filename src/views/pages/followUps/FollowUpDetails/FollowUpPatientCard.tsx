'use client';

import WorkItemPatientCard from '@/shared/components/common/WorkItemPatientCard';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpTaskCardProps} from '@/shared/interfaces/followUp';

const FollowUpPatientCard = ({task}: FollowUpTaskCardProps) => {
  const {t} = useTranslation();

  return (
    <WorkItemPatientCard
      patientId={task.patientId}
      patient={task.patient}
      alert={task.source.alert}
      title={t('followUps.detail.patient')}
      openPatientLabel={t('followUps.detail.openPatient')}
    />
  );
};

export default FollowUpPatientCard;
