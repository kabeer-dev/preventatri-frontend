'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ElapsedTimer from '@/shared/components/common/timers/ElapsedTimer';
import {
  ALERT_REVIEW_OVERLINE_SX,
  ALERT_REVIEW_SIZES,
} from '@/shared/constants/alertReview';
import useTranslation from '@/shared/hooks/useTranslation';
import {AlertAgeClockProps} from '@/shared/interfaces/alertReview';
import {formatElapsed, secondsBetweenIso} from '@/shared/utils/dateUtils';

const CLOCK_DIGITS_SX = {
  fontSize: ALERT_REVIEW_SIZES.clockDigits,
  lineHeight: 1.1,
  fontVariantNumeric: 'tabular-nums',
} as const;

// Live "Open for" while the alert waits, frozen "Accepted in" once the
// assignee takes it, frozen green "Resolved in" once a response closes it.
const AlertAgeClock = ({
  since,
  resolvedAt,
  acceptedAt,
  color,
  labelColor = 'text.secondary',
}: AlertAgeClockProps) => {
  const {t} = useTranslation();

  const stoppedAt = resolvedAt || acceptedAt;

  const label = resolvedAt
    ? t('alertReview.timing.resolvedIn')
    : acceptedAt
      ? t('alertReview.timing.acceptedIn')
      : t('alertReview.timing.openFor');

  return (
    <Box sx={{textAlign: {xs: 'left', sm: 'right'}}}>
      <Typography
        component='div'
        sx={{...ALERT_REVIEW_OVERLINE_SX, color: labelColor}}
      >
        {label}
      </Typography>
      {stoppedAt ? (
        <Typography
          variant='mono'
          component='div'
          sx={{
            ...CLOCK_DIGITS_SX,
            color: resolvedAt ? 'customColors.severityStableFg' : 'info.main',
          }}
        >
          {formatElapsed({
            seconds: secondsBetweenIso({from: since, to: stoppedAt}),
          })}
        </Typography>
      ) : (
        <ElapsedTimer
          since={since}
          variant='mono'
          component='div'
          sx={{...CLOCK_DIGITS_SX, color}}
        />
      )}
    </Box>
  );
};

export default AlertAgeClock;
