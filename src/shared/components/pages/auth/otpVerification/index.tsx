'use client';

import {useEffect} from 'react';

import {AUTH_ROUTES} from '@/shared/constants/paths';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import {useOTPContext} from '@/shared/providers/OTPExecutionProvider';

import OtpCard from './otpCard';

export default function OtpPage() {
  const router = useLocaleRouter();

  const {
    otpSession: {otpToken},
    isOtpVerified,
  } = useOTPContext();

  useEffect(() => {
    if (!otpToken && !isOtpVerified) {
      router.replace({url: AUTH_ROUTES.login()});
    }
  }, [otpToken, router, isOtpVerified]);

  if (!otpToken && !isOtpVerified) {
    return null;
  }

  return <OtpCard />;
}
