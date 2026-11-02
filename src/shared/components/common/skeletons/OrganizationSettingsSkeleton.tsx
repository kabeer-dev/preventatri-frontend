import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';

import {controlHeight, radius} from '@/@core/theme/spacing';
import ChipSkeleton from '@/shared/components/common/skeletons/ChipSkeleton';
import SettingsSectionHeaderSkeleton from '@/shared/components/common/skeletons/SettingsSectionHeaderSkeleton';
import SkeletonStatus from '@/shared/components/common/skeletons/SkeletonStatus';
import SkeletonText from '@/shared/components/common/skeletons/SkeletonText';
import {
  DAYS_ORDER,
  ORGANIZATION_SETTINGS_LAYOUT,
} from '@/shared/constants/settings';
import {
  SETTINGS_SKELETON,
  SKELETON_TEXT_WIDTH,
} from '@/shared/constants/skeletons';

const timeFieldSkeleton = (
  <Skeleton
    variant='rounded'
    width={ORGANIZATION_SETTINGS_LAYOUT.timeFieldWidth}
    height={controlHeight.md}
    sx={{borderRadius: `${radius.sm}px`}}
  />
);

const OrganizationSettingsSkeleton = () => (
  <>
    <SkeletonStatus />

    <Card>
      <SettingsSectionHeaderSkeleton hasAction />
      <Box className='flex items-center gap-4 px-4.5 pb-4'>
        <Box className='flex-1'>
          <SkeletonText variant='body2' width={SKELETON_TEXT_WIDTH.md} />
          <SkeletonText variant='caption' width={SKELETON_TEXT_WIDTH.lg} />
        </Box>
        <ChipSkeleton width={SKELETON_TEXT_WIDTH.xs} />
        <SkeletonText variant='body2' width={SKELETON_TEXT_WIDTH.sm} />
      </Box>
    </Card>

    <Card>
      <SettingsSectionHeaderSkeleton hasAction hasChip />
      {DAYS_ORDER.map((day) => (
        <Box
          key={day}
          className='flex items-center gap-3 px-4.5 py-2'
          sx={{
            minHeight: ORGANIZATION_SETTINGS_LAYOUT.dayRowHeight,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Skeleton
            variant='rounded'
            width={SETTINGS_SKELETON.switchWidth}
            height={SETTINGS_SKELETON.switchHeight}
            sx={{borderRadius: `${radius.full}px`}}
          />
          <SkeletonText variant='body' width={SKELETON_TEXT_WIDTH.sm} />
          <Box className='ml-auto hidden items-center gap-2 sm:flex'>
            {timeFieldSkeleton}
            {timeFieldSkeleton}
          </Box>
        </Box>
      ))}
    </Card>
  </>
);

export default OrganizationSettingsSkeleton;
