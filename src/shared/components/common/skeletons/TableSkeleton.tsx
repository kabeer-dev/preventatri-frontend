import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';

import {controlHeight} from '@/@core/theme/spacing';
import ChipSkeleton from '@/shared/components/common/skeletons/ChipSkeleton';
import SkeletonText from '@/shared/components/common/skeletons/SkeletonText';
import {TABLE_PAGINATION} from '@/shared/constants/common';
import {
  SKELETON_TEXT_WIDTH,
  TABLE_SKELETON,
} from '@/shared/constants/skeletons';
import {TableSkeletonProps} from '@/shared/interfaces/skeletons';

const TableSkeleton = ({
  rows = TABLE_PAGINATION.skeletonRows,
  hasTitle = true,
  titleInCard = false,
}: TableSkeletonProps) => (
  <Box className='flex flex-col' sx={{gap: 3.5}}>
    {hasTitle && !titleInCard && (
      <SkeletonText variant='h2' width={SKELETON_TEXT_WIDTH.lg} />
    )}

    <Card>
      {hasTitle && titleInCard && (
        <Box className='border-rule-strong flex items-center gap-2.5 border-b px-4.5 py-3.5'>
          <SkeletonText variant='h2' width={SKELETON_TEXT_WIDTH.lg} />
          <ChipSkeleton />
        </Box>
      )}

      <Box
        className='flex items-center'
        sx={{
          gap: 4,
          height: TABLE_SKELETON.headerHeight,
          px: TABLE_SKELETON.paddingX,
          borderBottom: '1px solid',
          borderColor: 'customColors.ruleStrong',
        }}
      >
        {Array.from({length: TABLE_SKELETON.columns}, (_, index) => (
          <SkeletonText
            key={index}
            variant='eyebrow'
            width={SKELETON_TEXT_WIDTH.sm}
            sx={{flex: 1}}
          />
        ))}
      </Box>

      {Array.from({length: rows}, (_, index) => (
        <Box
          key={index}
          className='flex items-center'
          sx={{
            gap: 4,
            height: TABLE_PAGINATION.rowHeight,
            px: TABLE_SKELETON.paddingX,
            borderBottom: '1px solid',
            borderColor: 'customColors.rule',
          }}
        >
          <Box className='flex items-center gap-3' sx={{flex: 1}}>
            <Skeleton
              variant='circular'
              width={TABLE_SKELETON.avatarSize}
              height={TABLE_SKELETON.avatarSize}
              sx={{flex: 'none'}}
            />
            <Skeleton sx={{flex: 1}} />
          </Box>

          {Array.from({length: TABLE_SKELETON.columns - 1}, (_, cellIndex) => (
            <Skeleton key={cellIndex} sx={{flex: 1}} />
          ))}
        </Box>
      ))}

      <Box
        className='flex items-center justify-between'
        sx={{height: TABLE_SKELETON.footerHeight, px: TABLE_SKELETON.paddingX}}
      >
        <Skeleton
          variant='rounded'
          width={SKELETON_TEXT_WIDTH.md}
          height={controlHeight.sm}
        />
        <Skeleton
          variant='rounded'
          width={SKELETON_TEXT_WIDTH.lg}
          height={controlHeight.sm}
        />
      </Box>
    </Card>
  </Box>
);

export default TableSkeleton;
