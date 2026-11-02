import Typography from '@mui/material/Typography';

import {FlagTimestampCellProps} from '@/shared/interfaces/emergencyFlag';
import {formatDate} from '@/shared/utils/dateUtils';

// A flag's timestamp as a muted table cell, or a dash when there is none.
const FlagTimestampCell = ({date}: FlagTimestampCellProps) => (
  <Typography noWrap variant='body' sx={{color: 'text.secondary'}}>
    {date ? formatDate({date, format: 'dd MMM yyyy, hh:mm a'}) : 'N/A'}
  </Typography>
);

export default FlagTimestampCell;
