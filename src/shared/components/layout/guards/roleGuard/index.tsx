'use client';

import {ReactNode, useEffect} from 'react';

import {usePathname} from 'next/navigation';

import GlobalLoader from '@/shared/components/common/loaders/GlobalLoader';
import NotAuthorizedContent from '@/shared/components/pages/notAuthorized';
import {SYSTEM_ROLES} from '@/shared/constants/common';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import {NodeChildrenProps} from '@/shared/interfaces/common';
import {
  getCaregiverReplacementPath,
  getRouteType,
  isHhaRoute,
} from '@/shared/utils/routeUtils';

const RoleGuard = ({children}: NodeChildrenProps): ReactNode => {
  const pathName = usePathname();
  const {replace} = useLocaleRouter();

  const {allowedRoles, isProtectedRoute} = getRouteType({
    pathname: pathName,
  });

  const shouldCheckRoles = isProtectedRoute && allowedRoles !== undefined;

  // A screen the redesign replaced for the caregiver. Some of them (Settings)
  // are open to every role, so the user has to be read here to know whether
  // this visitor is the caregiver.
  const caregiverReplacement = getCaregiverReplacementPath({path: pathName});

  // The HHAeXchange screens belong to one organization, so whether this
  // visitor is in it has to be read.
  const isHhaScreen = isHhaRoute({pathname: pathName});

  const {currentUser, isLoading, isLoggedIn} = useGetLoggedInUser({
    enabled: shouldCheckRoles || Boolean(caregiverReplacement) || isHhaScreen,
  });

  const userRole = currentUser?.currentActiveOrganization?.role;

  const isHhaBlocked =
    isHhaScreen &&
    isLoggedIn &&
    currentUser?.currentActiveOrganization?.hhaEnabled !== true;

  const isUnauthorizedRoute =
    isHhaBlocked ||
    (shouldCheckRoles && isLoggedIn && !allowedRoles.includes(userRole));

  // A caregiver who lands on a screen the redesign replaced is sent to its
  // replacement. Every other role still gets the page, or not-authorised.
  const replacementPath =
    isLoggedIn && userRole === SYSTEM_ROLES.caregiver.value
      ? caregiverReplacement
      : '';

  // `replace` is rebuilt on every render, so only the path is watched: adding
  // it would fire this effect again and again on the same route.
  useEffect(() => {
    if (replacementPath) replace({url: replacementPath});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replacementPath]);

  if (replacementPath) return <GlobalLoader className='h-screen' />;

  if ((shouldCheckRoles || caregiverReplacement || isHhaScreen) && isLoading) {
    return <GlobalLoader className='h-screen' />;
  }

  if (isUnauthorizedRoute) {
    return <NotAuthorizedContent />;
  }

  return children;
};

export default RoleGuard;
