'use client';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import useTranslation from '@/shared/hooks/useTranslation';
import {assessmentQueries} from '@/shared/reactQuery';

import EmergencyFlagDetailsUI from './EmergencyFlagDetailsUI';

interface EmergencyFlagDetailsProps {
  emergencyFlagId: string;
}

const EmergencyFlagDetails = ({emergencyFlagId}: EmergencyFlagDetailsProps) => {
  const {t} = useTranslation();
  const {useFetchEmergencyFlag} = assessmentQueries();

  const {data, isLoading, isError, refetch} = useFetchEmergencyFlag({
    id: emergencyFlagId,
  });

  if (isLoading) return <PageSkeleton {...PAGE_SKELETONS.flagCase} />;

  const emergencyFlag = data?.emergencyFlag;

  if (!emergencyFlag || isError) {
    return (
      <ContentNotAvailable
        title={t('emergencyFlags.notFoundTitle')}
        message={t('emergencyFlags.notFoundMessage')}
      />
    );
  }

  return (
    <EmergencyFlagDetailsUI
      emergencyFlag={emergencyFlag}
      onDispatchResolved={refetch}
    />
  );
};

export default EmergencyFlagDetails;
