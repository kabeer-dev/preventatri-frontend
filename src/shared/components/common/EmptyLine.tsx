import Typography from '@mui/material/Typography';

import {EmptyLineProps} from '@/shared/interfaces/uiComponents';

/** The one quiet sentence a caregiver list shows when it has nothing in it. */
const EmptyLine = ({text, sx}: EmptyLineProps) => (
  <Typography
    variant='body'
    sx={[{color: 'text.secondary'}, ...(Array.isArray(sx) ? sx : [sx])]}
  >
    {text}
  </Typography>
);

export default EmptyLine;
