import AlertAgeTimer from '@/shared/components/common/timers/AlertAgeTimer';
import {FlagRaisedCellProps} from '@/shared/interfaces/emergencyFlag';

import FlagTimestampCell from './FlagTimestampCell';

// When the flag was raised: a full timestamp, or on short dashboard lists its
// age, which stops once the flag is accepted or resolved.
const FlagRaisedCell = ({flag, relative}: FlagRaisedCellProps) =>
  relative ? (
    <AlertAgeTimer
      createdAt={flag.createdAt}
      status={flag.status}
      resolvedAt={flag.resolvedAt}
      acceptedAt={flag.acceptedAt}
      noWrap
      variant='body'
      sx={{color: 'text.secondary'}}
    />
  ) : (
    <FlagTimestampCell date={flag.createdAt} />
  );

export default FlagRaisedCell;
