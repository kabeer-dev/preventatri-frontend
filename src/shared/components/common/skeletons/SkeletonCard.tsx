import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import {controlHeight} from '@/@core/theme/spacing';
import ChipSkeleton from '@/shared/components/common/skeletons/ChipSkeleton';
import SkeletonRow from '@/shared/components/common/skeletons/SkeletonRow';
import SkeletonText from '@/shared/components/common/skeletons/SkeletonText';
import {
  SKELETON_CARD,
  SKELETON_CHIP_HEIGHT,
  SKELETON_TEXT_WIDTH,
} from '@/shared/constants/skeletons';
import {SkeletonCardProps} from '@/shared/interfaces/skeletons';

const SkeletonCard = ({
  surface = 'card',
  header = 'title',
  rows = SKELETON_CARD.rows,
  row,
  columns = 1,
  divided = false,
  hasAction = false,
  children,
}: SkeletonCardProps) => {
  const rowItems = Array.from({length: rows}, (_, index) => (
    <SkeletonRow key={index} {...row} />
  ));

  const content = (
    <Box className='flex flex-col gap-3.5'>
      {header === 'title' && (
        <SkeletonText variant='eyebrow' width={SKELETON_TEXT_WIDTH.md} />
      )}

      {header === 'profile' && (
        <>
          <Box className='flex flex-col items-center gap-2'>
            <Skeleton
              variant='circular'
              width={SKELETON_CARD.profileAvatarSize}
              height={SKELETON_CARD.profileAvatarSize}
              sx={{mb: 2}}
            />
            <SkeletonText variant='h6' width={SKELETON_TEXT_WIDTH.lg} />
            <ChipSkeleton height={SKELETON_CHIP_HEIGHT.medium} />
          </Box>
          <Divider sx={{my: 0}} />
        </>
      )}

      {rows > 0 && columns === 2 && (
        <Box className='grid grid-cols-1 gap-x-3.5 gap-y-3 md:grid-cols-2'>
          {rowItems}
        </Box>
      )}

      {rows > 0 && columns === 1 && (
        <Stack
          divider={divided ? <Divider sx={{my: 0}} /> : undefined}
          spacing={divided ? 0 : 3}
        >
          {rowItems}
        </Stack>
      )}

      {children}

      {hasAction && <Skeleton variant='rounded' height={controlHeight.md} />}
    </Box>
  );

  if (surface === 'plain') return content;

  return (
    <Card elevation={6}>
      <CardContent>{content}</CardContent>
    </Card>
  );
};

export default SkeletonCard;
