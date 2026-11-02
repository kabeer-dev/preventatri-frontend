import Box from '@mui/material/Box';

import SkeletonCard from '@/shared/components/common/skeletons/SkeletonCard';
import SkeletonText from '@/shared/components/common/skeletons/SkeletonText';
import StatsCardSkeleton from '@/shared/components/common/skeletons/StatsCardSkeleton';
import TableSkeleton from '@/shared/components/common/skeletons/TableSkeleton';
import {SKELETON_TEXT_WIDTH} from '@/shared/constants/skeletons';
import {PageSkeletonBlockProps} from '@/shared/interfaces/skeletons';

const PageSkeletonBlock = ({block}: PageSkeletonBlockProps) => {
  switch (block.type) {
    case 'card':
      return (
        <SkeletonCard {...block.card}>
          {block.nested && <SkeletonCard surface='plain' {...block.nested} />}
        </SkeletonCard>
      );

    case 'table':
      return <TableSkeleton titleInCard={block.titleInCard} />;

    case 'stats':
      return (
        <Box
          className='grid'
          sx={{
            gap: 3.5,
            gridTemplateColumns: {
              xs: '1fr',
              sm: `repeat(${block.count}, minmax(0, 1fr))`,
            },
          }}
        >
          {Array.from({length: block.count}, (_, index) => (
            <StatsCardSkeleton key={index} />
          ))}
        </Box>
      );

    case 'title':
      return <SkeletonText variant='h5' width={SKELETON_TEXT_WIDTH.lg} />;

    case 'text':
      return <SkeletonText variant='small' width={SKELETON_TEXT_WIDTH.md} />;
  }
};

export default PageSkeletonBlock;
