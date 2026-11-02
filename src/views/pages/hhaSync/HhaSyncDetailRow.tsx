import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {HhaSyncDetailRowProps} from '@/shared/interfaces/hhaSyncHistory';

// One label/value line of the run and exception dialogs.
const HhaSyncDetailRow = ({label, children}: HhaSyncDetailRowProps) => (
  <Box sx={{display: 'flex', gap: 4, alignItems: 'baseline'}}>
    <Typography
      variant='body2'
      sx={{color: 'text.secondary', minWidth: 150, flexShrink: 0}}
    >
      {label}
    </Typography>
    <Box sx={{minWidth: 0}}>{children}</Box>
  </Box>
);

export default HhaSyncDetailRow;
