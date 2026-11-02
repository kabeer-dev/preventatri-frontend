'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {useWatch} from 'react-hook-form';

import {
  AuthCard,
  AuthCardHeader,
  BackToLoginButton,
} from '@/shared/components/common/auth';
import PasswordPolicyChecklist from '@/shared/components/common/inputs/PasswordPolicyChecklist';
import RHFPasswordField from '@/shared/components/common/inputs/RHFPasswordField';
import useTranslation from '@/shared/hooks/useTranslation';
import {ResetPasswordFormUIProps} from '@/shared/interfaces/auth';

export default function ResetPasswordFormUI({
  control,
  isPending,
  onSubmit,
}: ResetPasswordFormUIProps) {
  const {t} = useTranslation();

  const password = useWatch({control, name: 'password'}) || '';

  return (
    <AuthCard>
      <AuthCardHeader
        title={t('auth.setNewPasswordTitle')}
        subtitle={t('auth.setNewPasswordSubtitle')}
      />

      <form noValidate autoComplete='off' onSubmit={onSubmit}>
        <Box className='flex flex-col gap-4'>
          <RHFPasswordField
            name='password'
            control={control}
            label={t('auth.newPassword')}
            placeholder={t('auth.newPasswordPlaceholder')}
            autoFocus
            spellCheck={false}
            autoComplete='new-password'
          />

          <RHFPasswordField
            name='confirmPassword'
            control={control}
            label={t('auth.confirmPassword')}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            spellCheck={false}
            autoComplete='new-password'
          />

          <PasswordPolicyChecklist password={password} />

          <Box className='flex flex-col gap-2.5'>
            <Button
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              loading={isPending}
            >
              {t('auth.setNewPassword')}
            </Button>

            <BackToLoginButton />
          </Box>
        </Box>
      </form>
    </AuthCard>
  );
}
