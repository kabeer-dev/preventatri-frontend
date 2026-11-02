import {useEffect, useState} from 'react';

import {UseCountdownProps} from '@/shared/interfaces/hooks';
import {formatCountdown, secondsUntilIso} from '@/shared/utils/dateUtils';

// Live countdown to an ISO timestamp. Ticks once per second and stops itself
// when the target is reached. Mirrors the proven useOTPTimer pattern but is
// context-free so any expiry can drive it.
export function useCountdown({expiresAt, onExpire}: UseCountdownProps) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    secondsUntilIso({iso: expiresAt})
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = secondsUntilIso({iso: expiresAt});
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  return {
    secondsLeft,
    formatted: formatCountdown({seconds: secondsLeft}),
    isExpired: secondsLeft <= 0,
  };
}
