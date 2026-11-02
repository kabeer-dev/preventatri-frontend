'use client';

import {ReactNode, useEffect} from 'react';

import {usePathname, useSearchParams} from 'next/navigation';

import GlobalLoader from '@/shared/components/common/loaders/GlobalLoader';
import {SessionTimeoutModal} from '@/shared/components/common/modals';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useSessionHeartbeat from '@/shared/hooks/useSessionHeartbeat';
import useSessionTimeout from '@/shared/hooks/useSessionTimeout';
import {AuthGuardProps} from '@/shared/interfaces/auth';
import {getHomeRoute, getRouteType} from '@/shared/utils/routeUtils';
import {getSafeReturnUrl, markReturnUrlRestored} from '@/shared/utils/urlUtils';

const AuthGuard = ({
  children,
  isAuthTokenInCookies,
}: AuthGuardProps): ReactNode => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useLocaleRouter();

  const {isAuthRoute, isProtectedRoute, isPublicRoute} = getRouteType({
    pathname: pathName,
  });

  const {isLoggedIn, isLoading, refetch, currentUser} = useGetLoggedInUser({
    enabled: isAuthTokenInCookies || isProtectedRoute,
  });

  const homeRoute = getHomeRoute({
    role: currentUser?.currentActiveOrganization?.role,
  });

  useSessionHeartbeat({isLoggedIn, refetch});

  const {
    isSessionTimedOut,
    shouldShowSessionTimeoutModal,
    isLogoutPending,
    handleSessionTimeoutLogout,
  } = useSessionTimeout({
    isLoggedIn,
    isProtectedRoute,
  });

  const shouldRedirectToLogin = !isLoggedIn && isProtectedRoute;

  const shouldRedirectToDashboard =
    isLoggedIn && isAuthRoute && !isSessionTimedOut;

  useEffect(() => {
    if (isLoading) return;

    if (isPublicRoute) return;

    if (shouldRedirectToLogin) {
      const returnUrl = encodeURIComponent(pathName);
      router.push({
        url: `${AUTH_ROUTES.login()}?returnUrl=${returnUrl}`,
      });
    } else if (shouldRedirectToDashboard) {
      const returnUrl = getSafeReturnUrl({
        returnUrl: searchParams.get('returnUrl'),
      });
      if (returnUrl) markReturnUrlRestored();

      router.push({url: returnUrl || homeRoute});
    }
  }, [
    isLoading,
    shouldRedirectToLogin,
    shouldRedirectToDashboard,
    homeRoute,
    router,
    isPublicRoute,
    pathName,
    searchParams,
  ]);

  // Show loader while checking auth status or during redirects
  const shouldShowLoader =
    isLoading || shouldRedirectToLogin || shouldRedirectToDashboard;

  return (
    <>
      {shouldShowLoader ? <GlobalLoader className='h-screen' /> : children}

      <SessionTimeoutModal
        isOpen={shouldShowSessionTimeoutModal}
        onLogout={handleSessionTimeoutLogout}
        isLogoutPending={isLogoutPending}
      />
    </>
  );
};

export default AuthGuard;
