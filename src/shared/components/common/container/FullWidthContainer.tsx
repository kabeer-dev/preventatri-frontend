import Box from '@mui/material/Box';

import {FullWidthContainerProps} from '@/shared/interfaces/common';
import {cn} from '@/shared/utils/tailwindUtils';

export default function FullWidthContainer({
  children,
  className,
}: FullWidthContainerProps) {
  return <Box className={cn('w-full', className)}>{children}</Box>;
}
