'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Link from '@/shared/components/common/localeLink';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import {AuthConfirmationCardProps} from '@/shared/interfaces/auth';

import AuthCard from './AuthCard';
import AuthCardHeader from './AuthCardHeader';
import BackToLoginButton from './BackToLoginButton';

export default function AuthConfirmationCard({
  title,
  subtitle,
  eyebrow,
  buttonText,
  buttonHref = AUTH_ROUTES.login(),
  backToLogin,
}: AuthConfirmationCardProps) {
  return (
    <AuthCard>
      <AuthCardHeader title={title} subtitle={subtitle} eyebrow={eyebrow} />

      <Box className='flex flex-col gap-2.5'>
        {buttonText && (
          <Button
            fullWidth
            component={Link}
            href={buttonHref}
            size='large'
            variant='contained'
          >
            {buttonText}
          </Button>
        )}

        {backToLogin && <BackToLoginButton />}
      </Box>
    </AuthCard>
  );
}
