import Box from '@mui/material/Box';

import {ContainerProps} from '@/shared/interfaces/common';
import {cn} from '@/shared/utils/tailwindUtils';

export default function Container({children, className}: ContainerProps) {
  return (
    <Box className={cn('w-full max-w-[1440px] px-5 md:px-10', className)}>
      {children}
    </Box>
  );
}
