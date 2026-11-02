'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {
  AuthCard,
  AuthCardHeader,
  BackToLoginButton,
} from '@/shared/components/common/auth';
import Link from '@/shared/components/common/localeLink';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {VerificationMessageProps} from '@/shared/interfaces/auth';
import {userMutations} from '@/shared/reactQuery';

const VerificationMessage = ({
  title,
  subtitle,
  email,
  showLoginButton,
  showResendButton,
}: VerificationMessageProps) => {
  const {t} = useTranslation();
  const {useResendVerificationMutation} = userMutations();

  const {mutate: executeResendPasswordMutation, isPending} =
    useResendVerificationMutation();

  const resendLink = () => {
    if (!email) return;
    executeResendPasswordMutation({payload: {email}});
  };

  return (
    <AuthCard>
      <AuthCardHeader title={title} subtitle={subtitle} />

      <Box className='flex flex-col gap-2.5'>
        {showResendButton && (
          <Button
            fullWidth
            size='large'
            variant='contained'
            onClick={resendLink}
            loading={isPending}
          >
            {t('auth.sendNewLink')}
          </Button>
        )}

        {showLoginButton ? (
          <Button
            fullWidth
            component={Link}
            href={AUTH_ROUTES.login()}
            size='large'
            variant='contained'
          >
            {t('auth.clickLogin')}
          </Button>
        ) : (
          <BackToLoginButton />
        )}
      </Box>
    </AuthCard>
  );
};

export default VerificationMessage;
