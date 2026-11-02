'use client';

import VerificationMessage from '@/shared/components/pages/auth/verify/verificationMessage';
import useAcceptInvitation from '@/shared/hooks/useAcceptInvitation';
import useTranslation from '@/shared/hooks/useTranslation';

import AcceptInvitationFormUI from './AcceptInvitationFormUI';

const AcceptInvitationHandler = ({token}: {token: string}) => {
  const {isTokenExpired, tokenError, email, control, isPending, onSubmit} =
    useAcceptInvitation({token});

  const {t} = useTranslation();

  if (isTokenExpired)
    return (
      <VerificationMessage
        title={t('auth.linkExpiredTitle')}
        subtitle={t('auth.invitationExpiredMessage')}
        showLoginButton
      />
    );

  if (tokenError)
    return (
      <VerificationMessage
        title={t('auth.invalidToken')}
        subtitle={t('auth.invalidInvitationMessage')}
        showLoginButton
      />
    );

  return (
    <AcceptInvitationFormUI
      control={control}
      email={email}
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
};

export default AcceptInvitationHandler;
