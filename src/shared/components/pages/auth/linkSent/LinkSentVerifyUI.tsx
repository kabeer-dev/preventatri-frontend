'use client';

import {AuthConfirmationCard} from '@/shared/components/common/auth';
import useTranslation from '@/shared/hooks/useTranslation';

export default function LinkSentVerifyUI() {
  const {t} = useTranslation();

  return (
    <AuthConfirmationCard
      backToLogin
      title={t('auth.verifyLinkSentTitle')}
      subtitle={t('verify.message')}
    />
  );
}
