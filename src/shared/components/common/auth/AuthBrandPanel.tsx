'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Logo from '@/shared/components/common/logo';
import useTranslation from '@/shared/hooks/useTranslation';

import AuthComplianceText from './AuthComplianceText';

export default function AuthBrandPanel() {
  const {t} = useTranslation();

  return (
    <Box
      component='aside'
      className='bg-shell hidden w-117.5 shrink-0 flex-col justify-center gap-6.5 p-14 lg:flex'
    >
      <Logo onDark className='-ml-2' />

      <Typography
        variant='display'
        component='p'
        sx={{color: 'common.white'}}
        className='max-w-[15ch]'
      >
        {t('auth.brandPanel.headline')}
      </Typography>

      <Typography variant='body' className='text-shell-text max-w-[32ch]'>
        {t('auth.brandPanel.tagline')}
      </Typography>

      <Box className='border-shell-active mt-5.5 flex flex-col gap-1.5 border-t pt-4.5'>
        <AuthComplianceText className='text-shell-muted' />
      </Box>
    </Box>
  );
}
