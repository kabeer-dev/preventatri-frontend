import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {NodeChildrenProps} from '@/shared/interfaces/common';

export default function AuthNote({children}: NodeChildrenProps) {
  return (
    <Box className='bg-surface-raised rounded-xl px-3.5 py-3'>
      <Typography variant='small' className='text-ink-muted'>
        {children}
      </Typography>
    </Box>
  );
}
