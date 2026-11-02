'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {
  AuthCard,
  AuthCardHeader,
  AuthNote,
  BackToLoginButton,
} from '@/shared/components/common/auth';
import useTranslation from '@/shared/hooks/useTranslation';
import {LinkSentResetUIProps} from '@/shared/interfaces/auth';
import {maskEmail} from '@/shared/utils/emailUtils';

export default function LinkSentResetUI({
  email,
  onResend,
}: LinkSentResetUIProps) {
  const {t, Trans} = useTranslation();

  return (
    <AuthCard>
      <AuthCardHeader
        title={t('auth.resetLinkSentTitle')}
        subtitle={
          <Trans
            t={t}
            i18nKey='auth.resetLinkSentSubtitleWithEmail'
            values={{email: maskEmail({email})}}
            components={{email: <span className='font-semibold break-all' />}}
          />
        }
      />

      <Box className='flex flex-col gap-2.5'>
        <Button fullWidth size='large' variant='contained' onClick={onResend}>
          {t('auth.sendItAgain')}
        </Button>

        <BackToLoginButton />
      </Box>

      <Box className='mt-4.5'>
        <AuthNote>{t('auth.resetLinkSentNote')}</AuthNote>
      </Box>
    </AuthCard>
  );
}
