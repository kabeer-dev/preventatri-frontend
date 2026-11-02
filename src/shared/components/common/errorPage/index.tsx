'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import Link from '@/shared/components/common/localeLink';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import {ErrorPageProps} from '@/shared/interfaces/common';

import ErrorCode from './ErrorCode';

export default function ErrorPage({
  code,
  title,
  message,
  backLabel,
  primaryAction,
  details,
}: ErrorPageProps) {
  const router = useLocaleRouter();

  return (
    <Box
      component='main'
      className='bg-page flex min-h-screen items-center justify-center overflow-hidden px-5 py-11 md:px-11'
    >
      <Box className='flex w-full max-w-340 flex-col items-center text-center'>
        <ErrorCode code={code} />

        <Typography variant='h1' className='mt-6.5'>
          {title}
        </Typography>

        <Typography variant='body' className='text-ink-muted mt-3 max-w-md'>
          {message}
        </Typography>

        {details}

        <Box className='mt-8.5 flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row'>
          {backLabel && (
            <Button
              variant='outlined'
              size='large'
              onClick={() => router.back()}
              startIcon={
                <Icon icon='mdi:arrow-left' fontSize={16} aria-hidden />
              }
            >
              {backLabel}
            </Button>
          )}
          <Button
            variant='contained'
            size='large'
            loading={primaryAction.isLoading}
            startIcon={
              primaryAction.icon && (
                <Icon icon={primaryAction.icon} fontSize={16} aria-hidden />
              )
            }
            {...(primaryAction.href
              ? {component: Link, href: primaryAction.href}
              : {onClick: primaryAction.onClick})}
          >
            {primaryAction.label}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
