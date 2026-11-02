import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import {controlHeight, radius} from '@/@core/theme/spacing';
import ChipSkeleton from '@/shared/components/common/skeletons/ChipSkeleton';
import SkeletonStatus from '@/shared/components/common/skeletons/SkeletonStatus';
import SkeletonText from '@/shared/components/common/skeletons/SkeletonText';
import {
  SETTINGS_SKELETON,
  SKELETON_TEXT_WIDTH,
} from '@/shared/constants/skeletons';

const actionSkeleton = (
  <Skeleton
    variant='rounded'
    width={SKELETON_TEXT_WIDTH.sm}
    height={controlHeight.md}
    sx={{borderRadius: `${radius.sm}px`}}
  />
);

const TwoStepVerificationSkeleton = () => (
  <Box className='flex flex-col'>
    <SkeletonStatus />
    <SkeletonText variant='h5' width={SKELETON_TEXT_WIDTH.lg} sx={{mb: 1}} />
    <SkeletonText variant='body2' width={SKELETON_TEXT_WIDTH.xl} sx={{mb: 5}} />
    <SkeletonText variant='body2' width={SKELETON_TEXT_WIDTH.md} sx={{mb: 2}} />

    <Box className='flex flex-col gap-2'>
      {Array.from({length: SETTINGS_SKELETON.otpOptions}, (_, index) => (
        <Box
          key={index}
          className='flex items-center gap-3 px-4 py-3'
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: `${radius.md}px`,
          }}
        >
          <Skeleton
            variant='circular'
            width={SETTINGS_SKELETON.radioSize}
            height={SETTINGS_SKELETON.radioSize}
          />
          <Skeleton
            variant='rounded'
            width={SETTINGS_SKELETON.iconSize}
            height={SETTINGS_SKELETON.iconSize}
          />
          <Box className='min-w-0 flex-1'>
            <SkeletonText variant='body' width={SKELETON_TEXT_WIDTH.sm} />
            <SkeletonText variant='body2' width={SKELETON_TEXT_WIDTH.lg} />
          </Box>
          {index === 0 && <ChipSkeleton width={SKELETON_TEXT_WIDTH.xs} />}
        </Box>
      ))}
    </Box>

    <Box className='flex justify-end gap-2 pt-5'>
      {actionSkeleton}
      {actionSkeleton}
    </Box>
  </Box>
);

export default TwoStepVerificationSkeleton;
