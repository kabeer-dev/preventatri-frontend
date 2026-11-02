'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {AuthCard, AuthCardHeader} from '@/shared/components/common/auth';
import RHFPasswordField from '@/shared/components/common/inputs/RHFPasswordField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import Link from '@/shared/components/common/localeLink';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {LoginFormUIProps} from '@/shared/interfaces/auth';

export default function LoginFormUI({
  control,
  isPending,
  onSubmit,
}: LoginFormUIProps) {
  const {t} = useTranslation();

  return (
    <AuthCard>
      <AuthCardHeader
        title={t('auth.signInTitle')}
        subtitle={t('auth.signInSubtitle')}
      />

      <form noValidate autoComplete='off' onSubmit={onSubmit}>
        <Box className='flex flex-col gap-4'>
          <RHFTextField
            name='email'
            control={control}
            type='email'
            label={t('auth.emailLabel')}
            placeholder={t('auth.emailPlaceholder')}
            autoFocus
          />

          <RHFPasswordField
            name='password'
            control={control}
            label={t('auth.passwordLabel')}
            placeholder={t('auth.passwordPlaceholder')}
            labelAction={
              <Typography
                variant='small'
                component={Link}
                href={AUTH_ROUTES.forgotPassword()}
                sx={{fontWeight: 600, lineHeight: 1.2}}
                className='text-brand no-underline hover:underline'
              >
                {t('auth.forgot')}
              </Typography>
            }
          />

          <Button
            fullWidth
            size='large'
            type='submit'
            variant='contained'
            loading={isPending}
          >
            {t('auth.continueText')}
          </Button>
        </Box>
      </form>

      <Box className='mt-5 flex items-center justify-center gap-1.5'>
        <Typography variant='small' className='text-ink-muted'>
          {t('auth.noOrganizationYet')}
        </Typography>

        <Typography
          variant='small'
          component={Link}
          href={AUTH_ROUTES.register()}
          sx={{fontWeight: 600, lineHeight: 1.2}}
          className='text-brand no-underline hover:underline'
        >
          {t('auth.createOrganization')}
        </Typography>
      </Box>

      <Box className='border-rule mt-5 flex items-center gap-2.5 border-t pt-4.5'>
        <Button variant='outlined' size='small' disabled>
          {t('auth.language')}
        </Button>

        <Typography variant='small' className='text-ink-muted ml-auto'>
          {t('auth.auditNotice')}
        </Typography>
      </Box>
    </AuthCard>
  );
}
