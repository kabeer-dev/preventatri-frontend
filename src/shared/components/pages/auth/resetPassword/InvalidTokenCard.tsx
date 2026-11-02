'use client';

import {AuthConfirmationCard} from '@/shared/components/common/auth';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';

export default function InvalidTokenCard() {
  const {t} = useTranslation();

  return (
    <AuthConfirmationCard
      backToLogin
      title={t('auth.invalidToken')}
      subtitle={t('auth.invalidTokenMessage')}
      buttonText={t('auth.getNewlink')}
      buttonHref={AUTH_ROUTES.forgotPassword()}
    />
  );
}
