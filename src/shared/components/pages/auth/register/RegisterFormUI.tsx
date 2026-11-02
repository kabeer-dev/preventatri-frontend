'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Control} from 'react-hook-form';

import {AuthCard, AuthCardHeader} from '@/shared/components/common/auth';
import RHFPasswordField from '@/shared/components/common/inputs/RHFPasswordField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import Link from '@/shared/components/common/localeLink';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {RegisterPayload} from '@/shared/types/auth';

interface RegisterFormUIProps {
  control: Control<RegisterPayload>;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RegisterFormUI({
  control,
  isPending,
  onSubmit,
}: RegisterFormUIProps) {
  const {t} = useTranslation();

  return (
    <AuthCard>
      <AuthCardHeader
        title={t('auth.signup')}
        subtitle={t('auth.signupSubtitle')}
      />
      <form noValidate autoComplete='off' onSubmit={onSubmit}>
        <Box sx={{mb: 4}}>
          <RHFTextField
            name='organizationName'
            control={control}
            label={t('auth.organizationName')}
            placeholder={t('auth.organizationNamePlaceholder')}
            autoFocus
          />
        </Box>
        <Box sx={{mb: 4}}>
          <RHFTextField
            name='firstName'
            control={control}
            label={t('auth.firstName')}
            placeholder={t('auth.firstNamePlaceholder')}
          />
        </Box>
        <Box sx={{mb: 4}}>
          <RHFTextField
            name='lastName'
            control={control}
            label={t('auth.lastName')}
            placeholder={t('auth.lastNamePlaceholder')}
          />
        </Box>
        <Box sx={{mb: 4}}>
          <RHFTextField
            name='email'
            control={control}
            label={t('auth.emailLabel')}
            placeholder={t('auth.emailPlaceholder')}
          />
        </Box>
        <Box sx={{mb: 4}}>
          <RHFTextField
            name='phoneNo'
            control={control}
            label={t('auth.phoneNoInputLabel')}
            placeholder={t('auth.phoneNoPlaceholder')}
            type='phone'
          />
        </Box>
        <Box sx={{mb: 4}}>
          <RHFPasswordField
            name='password'
            control={control}
            label={t('auth.passwordLabel')}
            placeholder={t('auth.passwordPlaceholder')}
            showPolicyChecklist
          />
        </Box>
        <Button
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          loading={isPending}
          sx={{mb: 7}}
        >
          {t('auth.signup')}
        </Button>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            component={Link}
            href={AUTH_ROUTES.login()}
            sx={{color: 'primary.main', textDecoration: 'none'}}
          >
            {t('auth.allReadyAccount')}
          </Typography>
        </Box>
      </form>
    </AuthCard>
  );
}
