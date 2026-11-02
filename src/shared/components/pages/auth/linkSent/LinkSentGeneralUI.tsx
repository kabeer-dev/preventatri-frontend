'use client';

import {AuthConfirmationCard} from '@/shared/components/common/auth';
import useTranslation from '@/shared/hooks/useTranslation';

export default function LinkSentGeneralUI() {
  const {t} = useTranslation();

  return (
    <AuthConfirmationCard
      backToLogin
      title={t('auth.emailSentTitle')}
      subtitle={t('general.emailLinkMessage')}
    />
  );
}
