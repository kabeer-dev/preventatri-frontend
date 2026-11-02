import Box from '@mui/material/Box';

import {GlobalLoaderProps} from '@/shared/interfaces/common';
import {cn} from '@/shared/utils/tailwindUtils';

import Loader from './Loader';

const GlobalLoader = ({className}: GlobalLoaderProps) => {
  return (
    <Box className={cn('flex-center h-full w-full flex-1', className)}>
      <Loader />
    </Box>
  );
};

export default GlobalLoader;
