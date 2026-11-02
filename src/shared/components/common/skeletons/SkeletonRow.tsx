import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import {controlHeight, radius} from '@/@core/theme/spacing';
import ChipSkeleton from '@/shared/components/common/skeletons/ChipSkeleton';
import SkeletonText from '@/shared/components/common/skeletons/SkeletonText';
import {SKELETON_ROW, SKELETON_TEXT_WIDTH} from '@/shared/constants/skeletons';
import {SkeletonRowProps} from '@/shared/interfaces/skeletons';

const SkeletonRow = ({
  leading = 'none',
  leadingSize = SKELETON_ROW.leadingSize,
  lines = SKELETON_ROW.lines,
  layout = 'stacked',
  trailing = 'none',
  sx,
}: SkeletonRowProps) => {
  const trailingElement = {
    none: null,
    text: (
      <SkeletonText
        variant='small'
        width={SKELETON_TEXT_WIDTH.sm}
        sx={{flex: 'none'}}
      />
    ),
    chip: <ChipSkeleton sx={{flex: 'none'}} />,
    button: (
      <Skeleton
        variant='rounded'
        width={SKELETON_TEXT_WIDTH.sm}
        height={controlHeight.sm}
        sx={{flex: 'none'}}
      />
    ),
  }[trailing];

  if (layout === 'inline') {
    return (
      <Box className='flex items-baseline gap-3' sx={sx}>
        <SkeletonText
          variant='small'
          width={SKELETON_ROW.inlineLabelWidth}
          sx={{flex: 'none'}}
        />
        <SkeletonText variant='bodyStrong' sx={{flex: 1}} />
        {trailingElement}
      </Box>
    );
  }

  const lineCount = Math.min(Math.max(lines, 1), SKELETON_ROW.maxLines);

  return (
    <Box className='flex items-center gap-3' sx={sx}>
      {leading !== 'none' && (
        <Skeleton
          variant={leading === 'circle' ? 'circular' : 'rounded'}
          width={leadingSize}
          height={leadingSize}
          sx={{
            flex: 'none',
            ...(leading === 'square' && {borderRadius: `${radius.sm}px`}),
          }}
        />
      )}

      <Box className='min-w-0 flex-1'>
        {Array.from({length: lineCount}, (_, index) => (
          <SkeletonText
            key={index}
            variant={index === 0 ? 'bodyStrong' : 'small'}
            width={
              index === 0 ? SKELETON_TEXT_WIDTH.lg : SKELETON_TEXT_WIDTH.md
            }
          />
        ))}
      </Box>

      {trailingElement}
    </Box>
  );
};

export default SkeletonRow;
