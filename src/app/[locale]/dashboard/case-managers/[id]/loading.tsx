import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';

export default function Loading() {
  return <PageSkeleton {...PAGE_SKELETONS.caseManagerDetails} />;
}
