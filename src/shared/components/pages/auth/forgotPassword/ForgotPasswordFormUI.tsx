'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {
  AuthCard,
  AuthCardHeader,
  AuthNote,
  BackToLoginButton,
} from '@/shared/components/common/auth';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import useTranslation from '@/shared/hooks/useTranslation';
import {ForgotPasswordFormUIProps} from '@/shared/interfaces/auth';

export default function ForgotPasswordFormUI({
  control,
  isPending,
  onSubmit,
}: ForgotPasswordFormUIProps) {
  const {t} = useTranslation();

  return (
    <AuthCard>
      <AuthCardHeader
        eyebrow={t('auth.forgotPasswordEyebrow')}
        title={t('auth.forgotPasswordTitle')}
        subtitle={t('auth.forgotPasswordSubtitle')}
      />

      <form noValidate autoComplete='off' onSubmit={onSubmit}>
        <RHFTextField
          name='email'
          control={control}
          type='email'
          label={t('auth.workEmailLabel')}
          placeholder={t('auth.emailPlaceholder')}
          autoFocus
        />

        <Box className='mt-4.5 flex flex-col gap-2.5'>
          <Button
            fullWidth
            size='large'
            type='submit'
            variant='contained'
            loading={isPending}
          >
            {t('auth.sendResetLink')}
          </Button>

          <BackToLoginButton />
        </Box>
      </form>

      <Box className='mt-4'>
        <AuthNote>{t('auth.forgotPasswordFootnote')}</AuthNote>
      </Box>
    </AuthCard>
  );
}
