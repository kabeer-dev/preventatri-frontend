'use client';

import {useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useForm} from 'react-hook-form';

import {
  AuthCard,
  AuthCardHeader,
  BackToLoginButton,
} from '@/shared/components/common/auth';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import useTranslation from '@/shared/hooks/useTranslation';
import {userMutations} from '@/shared/reactQuery';
import {sendResetPasswordLinkSchema} from '@/shared/schemas/auth';
import {ForgotPasswordPayload} from '@/shared/types/auth';

export function HandleUnverifiedLogin() {
  const {useResendVerificationMutation} = userMutations();
  const {t, ct} = useTranslation();

  const [isEmailSent, setIsEmailSent] = useState(false);

  const {mutate: executeResendVerificationMutation, isPending} =
    useResendVerificationMutation();

  const {control, handleSubmit} = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(ct({constant: sendResetPasswordLinkSchema})),
    defaultValues: {email: ''},
  });

  const sendVerification = ({email}: ForgotPasswordPayload) => {
    executeResendVerificationMutation({
      payload: {email},
      callBackFuncs: {
        onSuccess: () => {
          setIsEmailSent(true);
        },
      },
    });
  };

  const buttonLabel = isEmailSent
    ? t('auth.verificationEmailSent')
    : t('auth.resendVerificationEmail');

  return (
    <AuthCard>
      <AuthCardHeader
        icon='mdi:email-outline'
        title={t('auth.unverifiedLoginTitle')}
        subtitle={t('auth.unverifiedLoginSubtitle')}
      />

      <Box component='form' onSubmit={handleSubmit(sendVerification)}>
        <RHFTextField
          name='email'
          control={control}
          label={t('auth.emailLabel')}
          placeholder={t('auth.emailPlaceholder')}
          disabled={isEmailSent}
          sx={{mb: 4}}
        />
        <Box className='mb-2 flex flex-col gap-2.5'>
          <Button
            fullWidth
            size='large'
            type='submit'
            variant='contained'
            loading={isPending}
            disabled={isEmailSent}
          >
            {buttonLabel}
          </Button>

          <BackToLoginButton />
        </Box>
        {isEmailSent && (
          <Typography
            variant='body2'
            sx={{textAlign: 'center', color: 'text.secondary'}}
          >
            {t('auth.verificationEmailSentSubtitle')}
          </Typography>
        )}
      </Box>
    </AuthCard>
  );
}
