import Typography from '@mui/material/Typography';

import {REQUIRED_MARK} from '@/shared/constants/common';
import {RequiredMarkProps} from '@/shared/interfaces/uiComponents';

const RequiredMark = ({fontSize = 'inherit'}: RequiredMarkProps) => (
  <Typography
    component='span'
    aria-hidden
    sx={{color: 'error.main', fontWeight: 700, fontSize, ml: 1}}
  >
    {REQUIRED_MARK}
  </Typography>
);

export default RequiredMark;
