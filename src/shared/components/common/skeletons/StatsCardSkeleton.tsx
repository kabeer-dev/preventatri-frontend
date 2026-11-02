import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';

import {radius} from '@/@core/theme/spacing';
import SkeletonText from '@/shared/components/common/skeletons/SkeletonText';
import {STATS_CARD} from '@/shared/constants/dashboard';
import {SKELETON_TEXT_WIDTH} from '@/shared/constants/skeletons';

const StatsCardSkeleton = () => (
  <Card elevation={6} sx={{height: '100%', minHeight: STATS_CARD.minHeight}}>
    <CardContent sx={{p: STATS_CARD.padding}}>
      <Box className='flex items-center gap-2.5'>
        <Skeleton
          variant='rounded'
          width={STATS_CARD.iconTileSize}
          height={STATS_CARD.iconTileSize}
          sx={{borderRadius: `${radius.sm}px`, flex: 'none'}}
        />
        <SkeletonText variant='bodyStrong' width={SKELETON_TEXT_WIDTH.md} />
      </Box>

      <SkeletonText
        variant='metric'
        width={SKELETON_TEXT_WIDTH.sm}
        sx={{mt: 4}}
      />
      <SkeletonText
        variant='small'
        width={SKELETON_TEXT_WIDTH.lg}
        sx={{mt: 1.5}}
      />
    </CardContent>
  </Card>
);

export default StatsCardSkeleton;
