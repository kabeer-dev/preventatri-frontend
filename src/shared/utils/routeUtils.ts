import {
  CAREGIVER_FULL_SCREEN_ROUTES,
  CAREGIVER_REPLACED_ROUTES,
} from '@/shared/constants/caregiver';
import {SYSTEM_ROLES, type SystemRoleValue} from '@/shared/constants/common';
import {
  AUTH_ROUTES_LIST,
  DASHBOARD_ROUTES,
  DASHBOARD_ROUTE_CONFIGS,
} from '@/shared/constants/paths';
import {RouteConfig} from '@/shared/utils/routeRegistry';

export const normalizePath = ({path}: {path: string}) =>
  path.replace(/^\/[a-z]{2}(?=\/|$)/, '').replace(/\/+$/, '') || '/';

export const isPathActive = ({
  currentPath,
  targetPath,
}: {
  currentPath: string;
  targetPath?: string;
}) => {
  if (!targetPath) return false;

  const normalizedCurrentPath = normalizePath({path: currentPath});
  const normalizedTargetPath = normalizePath({path: targetPath});

  if (normalizedTargetPath === '/dashboard') {
    return normalizedCurrentPath === '/dashboard';
  }

  return (
    normalizedCurrentPath === normalizedTargetPath ||
    normalizedCurrentPath.startsWith(`${normalizedTargetPath}/`)
  );
};

// Helper function to check if a pathname matches a route pattern
export const matchesRoute = ({
  pathname,
  route,
}: {
  pathname: string;
  route: string;
}) => {
  const normalizedPathname = normalizePath({path: pathname});
  const normalizedRoute = normalizePath({path: route});

  // Converts route patterns containing dynamic params (e.g., ':param1') into regex-safe patterns.
  // Example: '/dashboard/businesses/:param1' → '/dashboard/businesses/[^/]+'.
  // This ensures the route matches only direct paths like '/dashboard/businesses/123' or '/dashboard/businesses/abc',
  // and not deeper or unrelated subpaths such as '/dashboard/businesses/add/123'.
  // This helps enforce stricter route matching and prevents access to unintended child routes.
  const regexPattern = normalizedRoute.replace(/:[^/]+/g, '[^/]+');
  const regex = new RegExp(`^${regexPattern}$`);

  return regex.test(normalizedPathname);
};

// True on a caregiver screen that hides the bottom tab bar, so the layout and
// the pinned action agree on where the bottom edge is.
export const isCaregiverFullScreenPath = ({path}: {path: string}) =>
  CAREGIVER_FULL_SCREEN_ROUTES.some((route) =>
    matchesRoute({pathname: path, route})
  );

// The caregiver screen that replaced `path`, or '' when nothing did. The id
// segment of the matched route, when it has one, is handed to the replacement.
export const getCaregiverReplacementPath = ({path}: {path: string}) => {
  const replaced = CAREGIVER_REPLACED_ROUTES.find(({route}) =>
    matchesRoute({pathname: path, route})
  );

  if (!replaced) return '';

  const routeParts = normalizePath({path: replaced.route}).split('/');
  const pathParts = normalizePath({path}).split('/');
  const idIndex = routeParts.findIndex((part) => part.startsWith(':'));

  return replaced.replacement({id: pathParts[idIndex] || ''});
};

const isPathMatchingAnyRoute = ({
  pathname,
  ROUTES_LIST,
}: {
  pathname: string;
  ROUTES_LIST: string[];
}) => ROUTES_LIST.some((route) => matchesRoute({pathname, route}));

const getMatchingRouteConfig = ({
  pathname,
  routeConfigs,
}: {
  pathname: string;
  routeConfigs: RouteConfig[];
}) => routeConfigs.find(({route}) => matchesRoute({pathname, route}));

export const getRouteType = ({pathname}: {pathname: string}) => {
  const matchedDashboardRoute = getMatchingRouteConfig({
    pathname,
    routeConfigs: DASHBOARD_ROUTE_CONFIGS,
  });

  const isDashboardRoute = Boolean(matchedDashboardRoute);

  const isAuthRoute = isPathMatchingAnyRoute({
    pathname,
    ROUTES_LIST: AUTH_ROUTES_LIST,
  });

  const isProtectedRoute = isDashboardRoute;
  const isUnProtectedRoute = !isProtectedRoute;

  const isPublicRoute = !isDashboardRoute && !isAuthRoute;

  return {
    allowedRoles: matchedDashboardRoute?.allowedRoles,
    isDashboardRoute,
    isAuthRoute,
    isProtectedRoute,
    isUnProtectedRoute,
    isPublicRoute,
  };
};

// Whether a user with `role` may open `pathname` as a post-login returnUrl.
// A returnUrl is always somewhere the user was inside the protected app, so we
// only honor paths that match a known dashboard route. Unknown paths
// (e.g. /does-not-exist) and non-dashboard paths are rejected so a stale or
// garbage returnUrl can't send the user to a not-found page — they fall back to
// the default home instead. A matched route with no role restriction is open to
// any logged-in user; a role-restricted route requires the role to be listed
// (mirroring RoleGuard).
export const canAccessRoute = ({
  pathname,
  role,
}: {
  pathname: string;
  role?: SystemRoleValue;
}): boolean => {
  const {allowedRoles, isDashboardRoute} = getRouteType({pathname});

  if (!isDashboardRoute) return false;

  if (allowedRoles === undefined) return true;

  return role !== undefined && allowedRoles.includes(role);
};

// Where a logged-in user lands. The super admin has no dashboard, only the
// organizations screen.
export const getHomeRoute = ({role}: {role?: string | null}): string =>
  role === SYSTEM_ROLES.superAdmin.value
    ? DASHBOARD_ROUTES.organizations.all()
    : DASHBOARD_ROUTES.home();

// The HHAeXchange screens. Only the organization HHAeXchange is connected to
// may open them.
export const isHhaRoute = ({pathname}: {pathname: string}): boolean =>
  [DASHBOARD_ROUTES.hhaVisits.all(), DASHBOARD_ROUTES.hhaSync.all()].some(
    (targetPath) => isPathActive({currentPath: pathname, targetPath})
  );

export const removeFirstSlash = ({path}: {path: string}): string => {
  const [_, ...rest] = path.split('/');

  return rest.join('/');
};
