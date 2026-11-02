'use client';

import {useEffect} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import ErrorCode from '@/shared/components/common/errorPage/ErrorCode';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {ContentNotAvailableProps} from '@/shared/interfaces/common';
import {getHomeRoute} from '@/shared/utils/routeUtils';
import {consumeRestoredReturnUrl} from '@/shared/utils/urlUtils';

const ContentNotAvailable = ({
  title,
  message,
  icon,
  onBack,
  showBackButton = true,
  backButtonText,
}: ContentNotAvailableProps) => {
  const router = useLocaleRouter();
  const {t} = useTranslation();
  const {userRole} = useUserRole();

  useEffect(() => {
    if (consumeRestoredReturnUrl()) {
      router.replace({url: getHomeRoute({role: userRole})});
    }
  }, [router, userRole]);

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <Box className='flex min-h-[75vh] flex-col items-center justify-center p-6 text-center'>
      <Box className='flex w-full max-w-110 flex-col items-center'>
        {icon ? (
          <Box className='text-ink-subtle [&>svg]:size-12 [&>svg]:fill-current'>
            {icon}
          </Box>
        ) : (
          <ErrorCode className='text-[56px]' />
        )}

        <Typography variant='h2' component='h2' className='mt-5'>
          {title || t('contentNotAvailable.title')}
        </Typography>

        <Typography variant='body' className='text-ink-muted mt-1.5 max-w-104'>
          {message || t('contentNotAvailable.message')}
        </Typography>

        {showBackButton && (
          <Button
            variant='outlined'
            size='medium'
            onClick={handleBack}
            className='mt-6'
            startIcon={
              !onBack && (
                <Icon icon='mdi:arrow-left' fontSize={16} aria-hidden />
              )
            }
          >
            {backButtonText || t('contentNotAvailable.goBack')}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ContentNotAvailable;
