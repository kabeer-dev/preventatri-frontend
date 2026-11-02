'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Control, useWatch} from 'react-hook-form';

import {AuthCard, AuthCardHeader} from '@/shared/components/common/auth';
import PasswordPolicyChecklist from '@/shared/components/common/inputs/PasswordPolicyChecklist';
import RHFPasswordField from '@/shared/components/common/inputs/RHFPasswordField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import useTranslation from '@/shared/hooks/useTranslation';
import {AcceptInvitationPayload} from '@/shared/types/auth';
import {maskEmail} from '@/shared/utils/emailUtils';

interface AcceptInvitationFormUIProps {
  control: Control<AcceptInvitationPayload>;
  email: string;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AcceptInvitationFormUI({
  control,
  email,
  isPending,
  onSubmit,
}: AcceptInvitationFormUIProps) {
  const {t, Trans} = useTranslation();

  const password = useWatch({control, name: 'password'}) || '';

  return (
    <AuthCard>
      <AuthCardHeader
        eyebrow={t('auth.acceptInvitationEyebrow')}
        title={t('auth.acceptInvitation')}
        subtitle={
          email ? (
            <Trans
              t={t}
              i18nKey='auth.acceptInvitationSubtitle'
              values={{email: maskEmail({email})}}
              components={{email: <span className='font-semibold break-all' />}}
            />
          ) : (
            t('auth.acceptInvitationSubtitleNoEmail')
          )
        }
      />
      <form noValidate autoComplete='off' onSubmit={onSubmit}>
        <Box className='mb-4 flex flex-col gap-4 sm:flex-row'>
          <RHFTextField
            name='firstName'
            control={control}
            label={t('auth.firstName')}
            placeholder={t('auth.firstNamePlaceholder')}
            autoFocus
          />
          <RHFTextField
            name='lastName'
            control={control}
            label={t('auth.lastName')}
            placeholder={t('auth.lastNamePlaceholder')}
          />
        </Box>
        <Box sx={{mb: 4}}>
          <RHFPasswordField
            name='password'
            control={control}
            label={t('auth.newPassword')}
            placeholder={t('auth.newPasswordPlaceholder')}
          />
        </Box>
        <Box sx={{mb: 4}}>
          <RHFPasswordField
            name='confirmPassword'
            control={control}
            label={t('auth.confirmPassword')}
            placeholder={t('auth.confirmPasswordPlaceholder')}
          />
        </Box>
        <Box sx={{mb: 4}}>
          <PasswordPolicyChecklist password={password} />
        </Box>
        <Button
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          loading={isPending}
        >
          {t('auth.completeRegistration')}
        </Button>
      </form>
    </AuthCard>
  );
}
