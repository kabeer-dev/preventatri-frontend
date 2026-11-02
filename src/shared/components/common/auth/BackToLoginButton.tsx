'use client';

import Button from '@mui/material/Button';

import Link from '@/shared/components/common/localeLink';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';

export default function BackToLoginButton() {
  const {t} = useTranslation();

  return (
    <Button
      fullWidth
      component={Link}
      href={AUTH_ROUTES.login()}
      size='large'
      variant='outlined'
    >
      {t('auth.backToLogin')}
    </Button>
  );
}
