'use client';

import {useEffect, useRef} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  AuthCard,
  AuthCardHeader,
  BackToLoginButton,
} from '@/shared/components/common/auth';
import Loader from '@/shared/components/common/loaders/Loader';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {userMutations} from '@/shared/reactQuery';

export function UnlockAccountHandler({token}: {token: string}) {
  const {useUnlockAccountMutation} = userMutations();
  const {t} = useTranslation();
  const router = useLocaleRouter();
  const hasCalledRef = useRef(false);

  const {
    mutate: executeUnlockAccount,
    isPending,
    isError,
  } = useUnlockAccountMutation();

  useEffect(() => {
    if (hasCalledRef.current) return;
    hasCalledRef.current = true;

    executeUnlockAccount({
      params: {token},
      callBackFuncs: {
        onSuccess: () => {
          router.push({url: AUTH_ROUTES.login()});
        },
      },
    });
  }, [token, executeUnlockAccount, router]);

  if (isError) {
    return (
      <AuthCard>
        <AuthCardHeader
          icon='mdi:link-variant-off'
          tone='critical'
          title={t('auth.unlockLinkExpiredTitle')}
          subtitle={t('auth.unlockLinkExpiredSubtitle')}
        />
        <Box className='flex flex-col gap-2.5'>
          <Button
            fullWidth
            size='large'
            variant='contained'
            href={AUTH_ROUTES.accountLocked()}
          >
            {t('auth.sendUnlockEmail')}
          </Button>

          <BackToLoginButton />
        </Box>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant='h2' sx={{mb: 2}}>
          {t('auth.unlockingAccountTitle')}
        </Typography>
        <Typography variant='body' sx={{color: 'text.secondary', mb: 6}}>
          {t('auth.unlockingAccountSubtitle')}
        </Typography>
        {isPending && <Loader size={48} />}
      </Box>
    </AuthCard>
  );
}
