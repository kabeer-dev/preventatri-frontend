'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Logo from '@/shared/components/common/logo';
import useTranslation from '@/shared/hooks/useTranslation';

export default function AuthMobileBrand() {
  const {t} = useTranslation();

  return (
    <Box className='flex w-full max-w-130 flex-col gap-3 px-1 pt-2 lg:hidden'>
      <Logo className='-ml-2' />

      <Typography
        variant='display'
        component='p'
        sx={{fontSize: 24, mt: 1}}
        className='max-w-[18ch]'
      >
        {t('auth.brandPanel.headline')}
      </Typography>

      <Typography variant='body' className='text-ink-soft max-w-[32ch]'>
        {t('auth.brandPanel.tagline')}
      </Typography>
    </Box>
  );
}
