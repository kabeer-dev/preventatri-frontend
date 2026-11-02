'use client';

import Box from '@mui/material/Box';

import AuthCurve from '@/shared/assets/shapes/authCurve.svg';
import {
  AuthBrandPanel,
  AuthComplianceText,
  AuthMobileBrand,
} from '@/shared/components/common/auth';
import {NodeChildrenProps} from '@/shared/interfaces/common';

const AuthLayout = ({children}: NodeChildrenProps) => {
  return (
    <Box className='bg-page relative flex min-h-screen overflow-hidden'>
      <AuthCurve
        aria-hidden
        className='text-brand-tint pointer-events-none absolute top-0 right-0 h-80 w-[62%] max-w-105 lg:hidden'
      />

      <AuthBrandPanel />

      <Box
        component='main'
        className='relative flex flex-1 flex-col items-center gap-5 px-4 pt-6 pb-10 lg:justify-center lg:p-14'
      >
        <AuthMobileBrand />

        {children}

        <AuthComplianceText
          className='text-ink-soft max-w-[36ch] text-center lg:hidden'
          sx={{fontSize: 11.5, fontWeight: 500}}
        />
      </Box>
    </Box>
  );
};

export default AuthLayout;
