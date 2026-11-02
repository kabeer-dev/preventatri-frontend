import Box from '@mui/material/Box';

import SkeletonRow from '@/shared/components/common/skeletons/SkeletonRow';
import SkeletonStatus from '@/shared/components/common/skeletons/SkeletonStatus';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {RECORD_HEADING} from '@/shared/constants/common';
import {SplitLayoutSkeletonProps} from '@/shared/interfaces/skeletons';

const SplitLayoutSkeleton = ({
  template,
  columns,
  hasRecordHeading = false,
  recordHeadingLines = RECORD_HEADING.skeletonLines,
  maxWidth,
}: SplitLayoutSkeletonProps) => (
  <>
    <SkeletonStatus />

    {hasRecordHeading && (
      <TopBarSlot side='left'>
        <SkeletonRow
          leading='circle'
          leadingSize={RECORD_HEADING.avatarSize}
          lines={recordHeadingLines}
        />
      </TopBarSlot>
    )}

    <Box
      aria-busy='true'
      className='grid items-start gap-4'
      sx={{
        gridTemplateColumns: {
          xs: '1fr',
          ...(template.md ? {md: template.md} : {}),
          lg: template.lg,
        },
        ...(maxWidth !== undefined && {maxWidth, mx: 'auto'}),
      }}
    >
      {columns.map((column, index) => (
        <Box key={index} className='flex min-w-0 flex-col gap-4'>
          {column}
        </Box>
      ))}
    </Box>
  </>
);

export default SplitLayoutSkeleton;
