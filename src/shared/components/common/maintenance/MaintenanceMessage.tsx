// components/common/maintenance/MaintenanceMessage.tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {MaintenanceMessageProps} from '@/shared/interfaces/common';
import {cn} from '@/shared/utils/tailwindUtils';

export default function MaintenanceMessage({
  title,
  message,
  className,
}: MaintenanceMessageProps) {
  return (
    <Box
      className={cn(
        'flex flex-col items-center space-y-4 px-6 sm:px-8 md:px-12',
        className
      )}
    >
      <Typography variant='h3' className='font-bold text-center relative z-10'>
        {title}
      </Typography>
      <Typography
        variant='body1'
        className='text-muted-foreground text-center relative z-10 max-w-xl'
      >
        {message}
      </Typography>
    </Box>
  );
}
