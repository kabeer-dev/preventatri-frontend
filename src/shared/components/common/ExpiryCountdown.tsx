'use client';

import TimerPill from '@/shared/components/common/activeFlag/TimerPill';
import {useCountdown} from '@/shared/hooks/useCountdown';
import useTranslation from '@/shared/hooks/useTranslation';
import {ExpiryCountdownProps} from '@/shared/interfaces/flag';

// Owns its own per-second ticking hook so only this pill re-renders each
// second, never the parent modal.
const ExpiryCountdown = ({
  expiresAt,
  accentColor,
  onExpire,
}: ExpiryCountdownProps) => {
  const {t} = useTranslation();

  const {formatted, isExpired} = useCountdown({expiresAt, onExpire});

  return (
    <TimerPill
      icon={isExpired ? 'mdi:timer-alert-outline' : 'mdi:timer-outline'}
      label={isExpired ? t('flag.expiry.expiredLabel') : t('flag.expiry.label')}
      value={isExpired ? undefined : formatted}
      accentColor={accentColor}
    />
  );
};

export default ExpiryCountdown;
