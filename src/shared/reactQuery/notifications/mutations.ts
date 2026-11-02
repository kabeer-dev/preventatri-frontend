import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

export const useMutations = () => ({
  useMarkAllNotificationsRead: () =>
    useMutationHandler({
      endpoint: API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ(),
      method: HTTP_METHODS.PATCH,
      toastConfigAlways: {
        error: {show: true},
      },
    }),
  useMarkNotificationAsRead: () =>
    useMutationHandler({
      endpoint: API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ,
      method: HTTP_METHODS.PATCH,
      toastConfigAlways: {
        error: {show: true},
      },
    }),
});
