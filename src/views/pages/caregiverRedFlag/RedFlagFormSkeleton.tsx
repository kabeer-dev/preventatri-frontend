'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import {controlHeight, layout, radius} from '@/@core/theme/spacing';
import SkeletonStatus from '@/shared/components/common/skeletons/SkeletonStatus';

interface Props {
  variant: 'screen' | 'dialog';
}

const roundedSx = {borderRadius: `${radius.md}px`};

const FieldSkeleton = ({height}: {height: number}) => (
  <Box>
    <Skeleton width={110} height={18} sx={{mb: 1.5}} />
    <Skeleton variant='rounded' height={height} sx={roundedSx} />
  </Box>
);

/** Mirrors RedFlagForm, plus the phone screen's header and pinned button. */
const RedFlagFormSkeleton = ({variant}: Props) => {
  const isScreen = variant === 'screen';

  const form = (
    <Box
      aria-busy='true'
      sx={{display: 'flex', flexDirection: 'column', gap: 5}}
    >
      <SkeletonStatus />

      <Skeleton variant='rounded' height={50} sx={roundedSx} />

      {isScreen && <Skeleton width='55%' height={20} />}

      <Box
        sx={{
          display: 'grid',
          gap: 5,
          gridTemplateColumns: isScreen ? '1fr' : '1fr 1fr',
        }}
      >
        <FieldSkeleton height={isScreen ? 144 : 52} />
        <FieldSkeleton height={52} />
      </Box>

      <FieldSkeleton height={isScreen ? 128 : 104} />
      <FieldSkeleton height={120} />
      <FieldSkeleton height={56} />
    </Box>
  );

  if (!isScreen) return form;

  return (
    <Box sx={{width: '100%', maxWidth: layout.formMaxWidth, mx: 'auto'}}>
      <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 4}}>
        <Skeleton variant='circular' width={40} height={40} />
        <Box sx={{flex: 1, display: 'flex', justifyContent: 'center'}}>
          <Skeleton width={90} height={22} />
        </Box>
        <Box sx={{width: 40}} />
      </Box>

      {form}

      <Box sx={{height: controlHeight.xl + 32}} />
    </Box>
  );
};

export default RedFlagFormSkeleton;
