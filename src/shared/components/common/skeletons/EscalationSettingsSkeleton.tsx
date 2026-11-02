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

const fieldSkeleton = (
  <Skeleton
    variant='rounded'
    height={controlHeight.md}
    sx={{flex: 1, borderRadius: `${radius.sm}px`}}
  />
);

const EscalationSettingsSkeleton = () => (
  <Box className='flex flex-col'>
    <SkeletonStatus />
    <SkeletonText variant='h5' width={SKELETON_TEXT_WIDTH.lg} />
    <SkeletonText variant='body2' width='70%' sx={{mb: 4}} />

    <Box className='flex flex-col gap-3'>
      <Skeleton
        variant='rounded'
        height={controlHeight.md + 8}
        sx={{borderRadius: `${radius.md}px`}}
      />

      <Box className='flex items-start justify-between gap-2'>
        <Box>
          <SkeletonText variant='subtitle1' width={SKELETON_TEXT_WIDTH.lg} />
          <SkeletonText variant='body2' width={SKELETON_TEXT_WIDTH.xl} />
        </Box>
        <Box className='flex gap-1.5'>
          <ChipSkeleton width={SKELETON_TEXT_WIDTH.xs} />
          <ChipSkeleton />
        </Box>
      </Box>

      {Array.from({length: SETTINGS_SKELETON.escalationSteps}, (_, index) => (
        <Box
          key={index}
          className='flex items-center gap-3 p-3'
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: `${radius.md}px`,
          }}
        >
          <Skeleton
            variant='circular'
            width={SETTINGS_SKELETON.stepBadgeSize}
            height={SETTINGS_SKELETON.stepBadgeSize}
          />
          {fieldSkeleton}
          <Box className='hidden flex-1 gap-3 md:flex'>
            {fieldSkeleton}
            {fieldSkeleton}
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

export default EscalationSettingsSkeleton;
