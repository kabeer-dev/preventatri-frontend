// components/common/maintenance/MaintenanceContainer.tsx
import Box from '@mui/material/Box';

import {MaintenanceContainerProps} from '@/shared/interfaces/common';
import {cn} from '@/shared/utils/tailwindUtils';

export default function MaintenanceContainer({
  children,
  className,
  blobColor = '#1F2559',
}: MaintenanceContainerProps) {
  return (
    <Box
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center bg-background overflow-hidden',
        className
      )}
    >
      {/* Background Round Blob */}
      <Box
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]'
        sx={{backgroundColor: blobColor}}
      />
      {children}
    </Box>
  );
}
