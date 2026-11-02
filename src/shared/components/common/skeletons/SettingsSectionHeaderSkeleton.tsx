import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import {controlHeight, radius} from '@/@core/theme/spacing';
import ChipSkeleton from '@/shared/components/common/skeletons/ChipSkeleton';
import SkeletonText from '@/shared/components/common/skeletons/SkeletonText';
import {
  SETTINGS_SKELETON,
  SKELETON_TEXT_WIDTH,
} from '@/shared/constants/skeletons';
import {SettingsSectionHeaderSkeletonProps} from '@/shared/interfaces/skeletons';

const SettingsSectionHeaderSkeleton = ({
  hasAction = false,
  hasChip = false,
}: SettingsSectionHeaderSkeletonProps) => (
  <Box className='flex items-start justify-between gap-3 px-4.5 pt-4 pb-3'>
    <Box className='min-w-0 flex-1'>
      <SkeletonText variant='subtitle1' width={SKELETON_TEXT_WIDTH.md} />
      <SkeletonText
        variant='body2'
        width={SKELETON_TEXT_WIDTH.xl}
        sx={{mt: 0.5}}
      />
    </Box>
    <Box className='flex items-center gap-2'>
      {hasChip && <ChipSkeleton width={SKELETON_TEXT_WIDTH.md} />}
      {hasAction && (
        <Skeleton
          variant='rounded'
          width={SETTINGS_SKELETON.buttonWidth}
          height={controlHeight.sm}
          sx={{borderRadius: `${radius.sm}px`}}
        />
      )}
    </Box>
  </Box>
);

export default SettingsSectionHeaderSkeleton;
