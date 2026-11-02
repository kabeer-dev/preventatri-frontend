import {useEffect, useState} from 'react';

import {useOTPContext} from '@/shared/providers/OTPExecutionProvider';
import {calculateSecondsLeft} from '@/shared/utils/dateUtils';

export function useOTPTimer() {
  const {
    otpSession: {expiryTime, otpRegenerateAllowedAfter, otpToken},
  } = useOTPContext();

  const [timeLeft, setTimeLeft] = useState(() =>
    calculateSecondsLeft({expiryTime})
  );

  const [otpResendTime, setOtpResendTime] = useState(() =>
    calculateSecondsLeft({expiryTime: otpRegenerateAllowedAfter})
  );

  useEffect(() => {
    if (!otpToken) return;

    const interval = setInterval(() => {
      const expiryTimeLeft = calculateSecondsLeft({expiryTime});
      setTimeLeft(expiryTimeLeft);

      setOtpResendTime(
        calculateSecondsLeft({expiryTime: otpRegenerateAllowedAfter})
      );

      if (expiryTimeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime, otpRegenerateAllowedAfter, otpToken]);

  return {timeLeft, otpResendTime};
}
