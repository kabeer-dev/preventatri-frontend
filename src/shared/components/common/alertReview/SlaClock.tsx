'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  ALERT_REVIEW_OVERLINE_SX,
  ALERT_REVIEW_SIZES,
} from '@/shared/constants/alertReview';
import {useCountdown} from '@/shared/hooks/useCountdown';
import useTranslation from '@/shared/hooks/useTranslation';
import {SlaClockProps} from '@/shared/interfaces/alertReview';
import {formatCountdown} from '@/shared/utils/dateUtils';

const SlaClock = ({expiresAt, color}: SlaClockProps) => {
  const {t} = useTranslation();

  const {formatted, isExpired} = useCountdown({expiresAt});

  return (
    <Box role='timer' sx={{textAlign: {xs: 'left', sm: 'right'}}}>
      <Typography
        component='div'
        sx={{...ALERT_REVIEW_OVERLINE_SX, color: 'customColors.shellMuted'}}
      >
        {isExpired
          ? t('flag.expiry.expiredLabel')
          : t('alertReview.timing.expiresIn')}
      </Typography>
      <Typography
        variant='mono'
        component='div'
        sx={{
          fontSize: ALERT_REVIEW_SIZES.clockDigits,
          lineHeight: 1.1,
          fontVariantNumeric: 'tabular-nums',
          color,
        }}
      >
        {isExpired ? formatCountdown({seconds: 0}) : formatted}
      </Typography>
    </Box>
  );
};

export default SlaClock;
