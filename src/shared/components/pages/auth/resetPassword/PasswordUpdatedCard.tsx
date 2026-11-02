'use client';

import {AuthConfirmationCard} from '@/shared/components/common/auth';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';

export default function PasswordUpdatedCard() {
  const {t} = useTranslation();

  return (
    <AuthConfirmationCard
      title={t('auth.passwordUpdatedTitle')}
      subtitle={t('auth.passwordUpdatedSubtitle')}
      buttonText={t('auth.signIn')}
      buttonHref={AUTH_ROUTES.login()}
    />
  );
}
