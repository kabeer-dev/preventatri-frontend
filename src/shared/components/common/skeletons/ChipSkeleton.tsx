import Skeleton from '@mui/material/Skeleton';

import {radius} from '@/@core/theme/spacing';
import {
  SKELETON_CHIP_HEIGHT,
  SKELETON_TEXT_WIDTH,
} from '@/shared/constants/skeletons';
import {ChipSkeletonProps} from '@/shared/interfaces/skeletons';

const ChipSkeleton = ({
  width = SKELETON_TEXT_WIDTH.sm,
  height = SKELETON_CHIP_HEIGHT.small,
  sx,
}: ChipSkeletonProps) => (
  <Skeleton
    variant='rounded'
    width={width}
    height={height}
    sx={{borderRadius: `${radius.full}px`, ...sx}}
  />
);

export default ChipSkeleton;
