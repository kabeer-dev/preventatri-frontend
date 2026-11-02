'use client';

import {OtpInput} from '@/shared/components/common/inputs/otpInput';
import useTranslation from '@/shared/hooks/useTranslation';
import {OtpInputsProps} from '@/shared/interfaces/auth';
import {useOTPContext} from '@/shared/providers/OTPExecutionProvider';

export const OtpInputs = ({control}: OtpInputsProps) => {
  const {t} = useTranslation();

  const {
    otpSession: {isEmailOtpRequired, isPhoneOtpRequired},
  } = useOTPContext();

  const isBothChannels = isEmailOtpRequired && isPhoneOtpRequired;

  return (
    <div className='flex flex-col gap-4'>
      {isEmailOtpRequired && (
        <OtpInput
          name='emailOtp'
          label={t('auth.emailOtpInputLabel')}
          hideLabel={!isBothChannels}
          control={control}
        />
      )}

      {isPhoneOtpRequired && (
        <OtpInput
          name='phoneOtp'
          label={t('auth.phoneOtpInputLabel')}
          hideLabel={!isBothChannels}
          control={control}
        />
      )}
    </div>
  );
};
