'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {usePathname} from 'next/navigation';

import ErrorPage from '@/shared/components/common/errorPage';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useTranslation from '@/shared/hooks/useTranslation';
import {getHomeRoute} from '@/shared/utils/routeUtils';

export default function NotFoundContent() {
  const {t} = useTranslation();
  const pathname = usePathname();

  // AuthGuard has already fetched the user when an auth cookie exists, so
  // reading the cache here avoids a second request on a public route.
  const {isLoggedIn, currentUser} = useGetLoggedInUser({enabled: false});

  const primaryAction = isLoggedIn
    ? {
        href: getHomeRoute({
          role: currentUser?.currentActiveOrganization?.role,
        }),
        label: t('notFound.goToDashboard'),
      }
    : {href: AUTH_ROUTES.login(), label: t('notFound.goToSignIn')};

  return (
    <ErrorPage
      code={t('notFound.heading')}
      title={t('notFound.title')}
      message={t('notFound.message')}
      backLabel={t('notFound.goBack')}
      primaryAction={primaryAction}
      details={
        <Box className='bg-rule-strong mt-5.5 inline-flex max-w-full items-center gap-2 rounded-full px-3.5 py-2'>
          <Typography variant='small' className='text-ink-subtle shrink-0'>
            {t('notFound.requestedPath')}
          </Typography>
          <Typography
            variant='mono'
            className='text-ink-muted min-w-0 truncate'
          >
            {pathname}
          </Typography>
        </Box>
      }
    />
  );
}
