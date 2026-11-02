import Box from '@mui/material/Box';

import SkeletonStatus from '@/shared/components/common/skeletons/SkeletonStatus';
import {CenteredColumnSkeletonProps} from '@/shared/interfaces/skeletons';

const CenteredColumnSkeleton = ({
  maxWidth,
  children,
}: CenteredColumnSkeletonProps) => (
  <>
    <SkeletonStatus />

    <Box
      aria-busy='true'
      className='flex flex-col'
      sx={{gap: 3, width: '100%', maxWidth, mx: 'auto'}}
    >
      {children}
    </Box>
  </>
);

export default CenteredColumnSkeleton;
