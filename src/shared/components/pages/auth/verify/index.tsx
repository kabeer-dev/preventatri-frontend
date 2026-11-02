'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {AuthCard} from '@/shared/components/common/auth';
import useTranslation from '@/shared/hooks/useTranslation';
import useVerifyUser from '@/shared/hooks/useVerifyUser';

import VerificationMessage from './verificationMessage';

const UserVerificationHandler = ({token}: {token: string}) => {
  const {
    isRequestPending,
    isTokenExpired,
    isUserVerified,
    tokenError,
    unVerifiedEmail,
  } = useVerifyUser({token});

  const {t} = useTranslation();

  if (isRequestPending)
    return (
      <AuthCard>
        <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
          <Typography variant='body1'>
            {t('loginIdentifier.message')}
          </Typography>
        </Box>
      </AuthCard>
    );

  if (isTokenExpired)
    return (
      <VerificationMessage
        title={t('auth.linkExpiredTitle')}
        subtitle={t('unverifiedVerfication.message')}
        email={unVerifiedEmail}
        showResendButton
      />
    );

  if (tokenError)
    return (
      <VerificationMessage
        title={t('auth.verificationErrorTitle')}
        subtitle={t('unVerifiedEmail.message')}
        email={unVerifiedEmail}
        showResendButton
      />
    );

  if (isUserVerified)
    return (
      <VerificationMessage
        title={t('auth.accountVerifiedTitle')}
        subtitle={t('successfulAccountVerified.message')}
        showLoginButton
      />
    );

  if (isUserVerified === false)
    return (
      <VerificationMessage
        title={t('auth.verificationFailedTitle')}
        subtitle={t('unSuccessfulAccountVerified.message')}
        email={unVerifiedEmail}
        showResendButton
      />
    );

  return null;
};

export default UserVerificationHandler;
