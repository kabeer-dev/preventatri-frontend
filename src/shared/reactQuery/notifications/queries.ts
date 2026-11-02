'use client';

import {useInfiniteQuery} from '@tanstack/react-query';
import {AxiosResponse} from 'axios';

import {NOTIFICATIONS_INFINITE_SCROLL} from '@/shared/constants/notifications';
import {
  QUERY_RETRY_CONFIG,
  QUERY_TIMINGS,
} from '@/shared/constants/reactQuery/general';
import {NOTIFICATIONS} from '@/shared/constants/reactQueryConstants';
import {ErrorResponse} from '@/shared/interfaces/common';
import {
  FetchNotificationsQueryFnArg,
  NotificationsAxiosResponse,
  NotificationsListSource,
  NotificationsPage,
  UseInfiniteNotificationsProps,
} from '@/shared/interfaces/notification';
import {getRequest} from '@/shared/utils/requests';

// The viewer's own list and the admin's all-users list page, filter and cache
// the same way; only the endpoint and its query key differ.
const useInfiniteNotificationsList = ({
  source,
  enabled = true,
  limit = NOTIFICATIONS_INFINITE_SCROLL.pageLimit,
  startDate,
  endDate,
}: UseInfiniteNotificationsProps & {source: NotificationsListSource}) =>
  useInfiniteQuery<NotificationsPage, ErrorResponse>({
    queryKey: [source.queryKey, startDate, endDate],
    initialPageParam: 1,
    queryFn: async ({pageParam}: FetchNotificationsQueryFnArg) => {
      const endpoint = source.endpoint({
        params: {page: pageParam as number, limit, startDate, endDate},
      });

      const response: AxiosResponse<NotificationsAxiosResponse> =
        await getRequest({
          endpoint,
        });

      const {notifications, meta, unreadCount} = response.data.body;

      return {data: notifications, meta, unreadCount};
    },
    getNextPageParam: (lastPage: NotificationsPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    staleTime: QUERY_TIMINGS.STALE_TIME,
    gcTime: QUERY_TIMINGS.GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    retry: QUERY_RETRY_CONFIG.ATTEMPTS,
    retryDelay: QUERY_RETRY_CONFIG.DELAY_FUNCTION,
    enabled,
  });

export const useQueries = () => ({
  useInfiniteNotifications: (props: UseInfiniteNotificationsProps = {}) =>
    useInfiniteNotificationsList({
      ...props,
      source: NOTIFICATIONS.fetchNotifications,
    }),

  // Every user's notifications in the organization, each with its recipient.
  useInfiniteAllNotifications: (props: UseInfiniteNotificationsProps = {}) =>
    useInfiniteNotificationsList({
      ...props,
      source: NOTIFICATIONS.fetchAllNotifications,
    }),
});
