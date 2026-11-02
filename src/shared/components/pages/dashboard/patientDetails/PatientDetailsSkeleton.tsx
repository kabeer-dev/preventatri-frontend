'use client';

import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useUserRole from '@/shared/hooks/useUserRole';

const PatientDetailsSkeleton = () => {
  const {isCaregiver} = useUserRole();

  const isDesktop = useIsDesktop();

  if (isCaregiver && !isDesktop) {
    return <PageSkeleton {...PAGE_SKELETONS.caregiverPatientPhone} />;
  }

  return <PageSkeleton {...PAGE_SKELETONS.patientDetails} />;
};

export default PatientDetailsSkeleton;
