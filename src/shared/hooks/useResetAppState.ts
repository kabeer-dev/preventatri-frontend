import {AUTH_ROUTES, DASHBOARD_ROOT} from '@/shared/constants/paths';
import {store} from '@/shared/redux/store';
import {resetAllSlices} from '@/shared/utils/resetAllSlices';

export const resetAppState = () => {
  store.dispatch(resetAllSlices());

  const currentPath = window.location.pathname;
  const isDashboardRoute = currentPath.includes(DASHBOARD_ROOT);
  const loginUrl = AUTH_ROUTES.login();

  window.location.href = isDashboardRoute
    ? `${loginUrl}?returnUrl=${encodeURIComponent(currentPath)}`
    : loginUrl;
};

export const useResetAppState = () => resetAppState;
