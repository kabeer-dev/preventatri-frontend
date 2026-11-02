'use client';

import {useState, useEffect} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import {OTP_REGENERATE_TYPE, OTP_VIEW_TYPE} from '@/shared/constants/general';
import {APP_ENVIRONMENTS} from '@/shared/constants/reactQuery/general';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import {useOTPTimer} from '@/shared/hooks/useOTPTimer';
import useTranslation from '@/shared/hooks/useTranslation';
import {useOTPContext} from '@/shared/providers/OTPExecutionProvider';
import {userMutations} from '@/shared/reactQuery';
import {getValidateOtpSchema} from '@/shared/schemas/auth';
import {OtpVerificationPayload} from '@/shared/types/auth';
import {maskEmail} from '@/shared/utils/emailUtils';
import {getPhoneEnding} from '@/shared/utils/otpUtils';

import OtpCardUI from './OtpCardUI';

interface OtpCardProps {
  onClose?: () => void;
}

export default function OtpCard({onClose}: OtpCardProps) {
  const {t, Trans} = useTranslation();
  const router = useLocaleRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {timeLeft, otpResendTime} = useOTPTimer();

  const isRegenerateDisabled = otpResendTime > 0 || timeLeft <= 0;

  const {useRegeneratePublicOTPMutation, useRegeneratePrivateOTPMutation} =
    userMutations();

  const {
    mutate: executeRegeneratePublicOTPMutation,
    isPending: isPublicRegenerationPending,
  } = useRegeneratePublicOTPMutation();

  const {
    mutate: executeRegeneratePrivateOTPMutation,
    isPending: isPrivateRegenerationPending,
  } = useRegeneratePrivateOTPMutation();

  const {
    otpSession: {otpToken, isEmailOtpRequired, isPhoneOtpRequired},
    otpMutationConfig: {otpRegenerateType},
  } = useOTPContext();

  const {
    otpMutationConfig: {
      mutation,
      payload,
      callBackFuncs,
      extraComponentToRender,
      type,
    },
    clearOtpSessionAndMutationConfig,
  } = useOTPContext();

  useEffect(() => {
    return () => {
      if (
        process.env.NEXT_PUBLIC_ENVIRONMENT ===
        APP_ENVIRONMENTS.production.value
      ) {
        clearOtpSessionAndMutationConfig({isOtpVerified: false});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {control, handleSubmit, getValues} = useForm<OtpVerificationPayload>({
    resolver: zodResolver(
      getValidateOtpSchema({isEmailOtpRequired, isPhoneOtpRequired, t})
    ),
    defaultValues: {emailOtp: '', phoneOtp: ''},
  });

  const isBothChannels = isEmailOtpRequired && isPhoneOtpRequired;

  // The payload the user submitted on the previous screen is kept on the OTP
  // mutation config, so the address they typed is the one named here. It is
  // typed as any, hence the narrowing.
  const destinationEmail =
    typeof payload?.email === 'string' ? payload.email : undefined;

  const destinationPhone =
    typeof payload?.phone === 'string' ? payload.phone : undefined;

  const getSubHeadingText = () => {
    if (isBothChannels) return t('otpVerification.subHeadingBoth');

    if (isEmailOtpRequired) {
      return destinationEmail ? (
        <Trans
          t={t}
          i18nKey='otpVerification.subHeadingEmailTo'
          values={{destination: maskEmail({email: destinationEmail})}}
          components={{
            destination: <span className='font-semibold break-all' />,
          }}
        />
      ) : (
        t('otpVerification.subHeadingEmail')
      );
    }

    return destinationPhone ? (
      <Trans
        t={t}
        i18nKey='otpVerification.subHeadingPhoneTo'
        values={{ending: getPhoneEnding({phone: destinationPhone})}}
        components={{destination: <span className='font-semibold' />}}
      />
    ) : (
      t('otpVerification.subHeadingPhone')
    );
  };

  const getTitleText = () => {
    if (type === OTP_VIEW_TYPE.modal.value)
      return t('otpVerification.modalTitle');

    return isBothChannels
      ? t('otpVerification.codeTitleBoth')
      : t('otpVerification.codeTitle');
  };

  const getEyebrowText = () => {
    if (isBothChannels) return t('otpVerification.eyebrowBoth');

    return isEmailOtpRequired
      ? t('otpVerification.eyebrowEmail')
      : t('otpVerification.eyebrowPhone');
  };

  const getHeaderIcon = () => {
    if (isBothChannels) return 'mdi:shield-key-outline';

    return isEmailOtpRequired ? 'mdi:email-outline' : 'mdi:cellphone';
  };

  const onSuccess = ({data}: {data: any}) => {
    clearOtpSessionAndMutationConfig({isOtpVerified: true});
    if (callBackFuncs?.onSuccess) callBackFuncs?.onSuccess({data});
  };

  const onSubmit = async () => {
    const emailOtp = getValues('emailOtp');
    const phoneOtp = getValues('phoneOtp');

    if (mutation) {
      setIsSubmitting(true);
      try {
        const finalPayload = {
          ...(payload ? payload : {}),
          token: otpToken,
          ...(isEmailOtpRequired && {emailOtp}),
          ...(isPhoneOtpRequired && {phoneOtp}),
        };
        await mutation({
          payload: finalPayload,
          callBackFuncs: {...callBackFuncs, onSuccess},
        });
      } catch {
        // mutation handler surfaces errors
        setIsSubmitting(false);
      }
    }
  };

  const onOTPRegenerate = () => {
    if (otpRegenerateType === OTP_REGENERATE_TYPE.public.value) {
      executeRegeneratePublicOTPMutation({
        payload: {
          token: otpToken,
        },
      });
    } else if (otpRegenerateType === OTP_REGENERATE_TYPE.private.value) {
      executeRegeneratePrivateOTPMutation({
        payload: {
          token: otpToken,
        },
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <OtpCardUI
      control={control}
      isSubmitting={isSubmitting}
      timeLeft={timeLeft}
      otpResendTime={otpResendTime}
      isRegenerateDisabled={isRegenerateDisabled}
      isRegenerationPending={
        isPublicRegenerationPending || isPrivateRegenerationPending
      }
      showGoBack={type === OTP_VIEW_TYPE.page.value}
      isModal={type === OTP_VIEW_TYPE.modal.value}
      title={getTitleText()}
      eyebrow={getEyebrowText()}
      icon={getHeaderIcon()}
      subtitle={getSubHeadingText()}
      extraComponentToRender={extraComponentToRender}
      onSubmit={handleSubmit(onSubmit)}
      onGoBack={handleGoBack}
      onResend={onOTPRegenerate}
      onClose={onClose}
    />
  );
}
