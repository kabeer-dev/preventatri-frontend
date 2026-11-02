'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  AuthCard,
  AuthCardHeader,
  AuthNote,
} from '@/shared/components/common/auth';
import {DialogCloseButton} from '@/shared/components/common/modals';
import {OTP_MODAL_TITLE_ID} from '@/shared/constants/common';
import useTranslation from '@/shared/hooks/useTranslation';
import {OtpCardUIProps} from '@/shared/interfaces/auth';
import {formatToMinutesSeconds} from '@/shared/utils/dateUtils';

import {OtpInputs} from './otpInputs';

export default function OtpCardUI({
  control,
  isSubmitting,
  timeLeft,
  otpResendTime,
  isRegenerateDisabled,
  isRegenerationPending,
  showGoBack,
  isModal = false,
  title,
  eyebrow,
  icon,
  subtitle,
  extraComponentToRender,
  onSubmit,
  onGoBack,
  onResend,
  onClose,
}: OtpCardUIProps) {
  const {t} = useTranslation();

  return (
    <AuthCard>
      {isModal && (
        <DialogCloseButton
          onClick={onClose}
          className='absolute top-4 right-4 z-10'
        />
      )}

      <Box className={isModal ? 'pr-6' : undefined}>
        <AuthCardHeader
          icon={icon}
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          titleId={isModal ? OTP_MODAL_TITLE_ID : undefined}
          titleComponent={isModal ? 'h2' : 'h1'}
        />
      </Box>

      <form noValidate autoComplete='off' onSubmit={onSubmit}>
        <OtpInputs control={control} />

        {extraComponentToRender}

        <Box className='mt-3 flex flex-wrap items-center gap-2.5'>
          {timeLeft > 0 ? (
            <Typography variant='small' className='text-ink-muted'>
              {t('otpVerification.expireTime')}{' '}
              <Typography variant='mono' component='span'>
                {formatToMinutesSeconds({seconds: timeLeft})}
              </Typography>
            </Typography>
          ) : (
            <Typography variant='small' className='text-severity-critical-fg'>
              {t('otpVerification.otpExpired')}
            </Typography>
          )}

          <Button
            size='small'
            onClick={onResend}
            disabled={isRegenerateDisabled || isRegenerationPending}
            className='ml-auto min-w-0 px-2 py-1'
          >
            {otpResendTime > 0
              ? t('otpVerification.regenerateCountdown', {
                  seconds: otpResendTime,
                })
              : t('otpVerification.resendCode')}
          </Button>
        </Box>

        <Box className='mt-5.5 flex flex-col gap-2.5'>
          <Button
            fullWidth
            size='large'
            type='submit'
            variant='contained'
            loading={isSubmitting}
            disabled={timeLeft <= 0}
          >
            {isModal
              ? t('otpVerification.authorizeAction')
              : t('otpVerification.verify')}
          </Button>

          {showGoBack && (
            <Button
              fullWidth
              size='large'
              variant='outlined'
              onClick={onGoBack}
            >
              {t('auth.goBack')}
            </Button>
          )}
        </Box>

        <Box className='mt-4.5'>
          <AuthNote>{t('otpVerification.deliveryNote')}</AuthNote>
        </Box>
      </form>
    </AuthCard>
  );
}
