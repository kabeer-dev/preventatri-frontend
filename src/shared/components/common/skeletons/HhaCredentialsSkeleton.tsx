import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';

import {controlHeight, radius} from '@/@core/theme/spacing';
import SettingsSectionHeaderSkeleton from '@/shared/components/common/skeletons/SettingsSectionHeaderSkeleton';
import SkeletonStatus from '@/shared/components/common/skeletons/SkeletonStatus';
import SkeletonText from '@/shared/components/common/skeletons/SkeletonText';
import {SKELETON_TEXT_WIDTH} from '@/shared/constants/skeletons';

const actionSkeleton = (
  <Skeleton
    variant='rounded'
    width={SKELETON_TEXT_WIDTH.md}
    height={controlHeight.md}
    sx={{borderRadius: `${radius.sm}px`}}
  />
);

const HhaCredentialsSkeleton = () => (
  <Card>
    <SkeletonStatus />
    <SettingsSectionHeaderSkeleton hasChip />
    <Box className='flex flex-wrap items-center gap-4 px-4.5 pb-4'>
      <Box className='min-w-0 flex-1'>
        <SkeletonText variant='body2' width={SKELETON_TEXT_WIDTH.md} />
        <SkeletonText variant='caption' width={SKELETON_TEXT_WIDTH.lg} />
      </Box>
      <Box className='flex gap-2'>
        {actionSkeleton}
        {actionSkeleton}
      </Box>
    </Box>
  </Card>
);

export default HhaCredentialsSkeleton;
