'use client';

import {useCallback, useMemo} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useQueryClient} from '@tanstack/react-query';

import {layout} from '@/@core/theme/spacing';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import useInfiniteScrollSentinel from '@/shared/hooks/useInfiniteScrollSentinel';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useMarkNotificationRead from '@/shared/hooks/useMarkNotificationRead';
import useNotificationDateRange from '@/shared/hooks/useNotificationDateRange';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {notificationMutations, notificationQueries} from '@/shared/reactQuery';
import {
  flattenNotificationPages,
  patchNotificationsCache,
} from '@/shared/utils/notificationsUtils';

import NotificationsFeed from './NotificationsFeed';

const NotificationsPage = () => {
  const {t} = useTranslation();
  const {isCaregiver} = useUserRole();

  const isDesktop = useIsDesktop();

  // Caregivers get the list in a card like their other screens, since the
  // full-bleed sheet overflows the narrower phone gutter, plus a subtitle on phone.
  const hasPhoneSubtitle = isCaregiver && !isDesktop;

  const queryClient = useQueryClient();

  const {dateRange, setDateRange} = useNotificationDateRange();

  const {useInfiniteNotifications} = notificationQueries();

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} =
    useInfiniteNotifications(dateRange);

  const setSentinelNode = useInfiniteScrollSentinel({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const markRead = useMarkNotificationRead();

  const {useMarkAllNotificationsRead} = notificationMutations();
  const {mutate: markAllRead, isPending} = useMarkAllNotificationsRead();

  const notifications = useMemo(
    () => flattenNotificationPages({pages: data?.pages}),
    [data]
  );

  const unreadCount = data?.pages?.[0]?.unreadCount ?? 0;
  const totalCount = data?.pages?.[0]?.meta.count ?? notifications.length;

  const handleMarkAllRead = useCallback(() => {
    patchNotificationsCache({queryClient, unreadCount: 0});
    markAllRead({});
  }, [markAllRead, queryClient]);

  return (
    <>
      {hasPhoneSubtitle && (
        <Typography
          sx={{fontSize: '0.875rem', color: 'text.secondary', mt: -3, mb: 4}}
        >
          {t('caregiverNotifications.subtitle')}
        </Typography>
      )}

      <Box
        className={
          isCaregiver
            ? 'bg-surface border-rule overflow-hidden rounded-lg border'
            : undefined
        }
        sx={
          isCaregiver
            ? undefined
            : {
                flexGrow: 1,
                mx: {xs: -4, sm: `-${layout.pageGutter}px`},
                my: `-${layout.pageGutterY}px`,
                backgroundColor: 'background.paper',
              }
        }
      >
        <TopBarSlot side='right'>
          <Button
            variant='contained'
            onClick={handleMarkAllRead}
            disabled={isPending || unreadCount === 0}
          >
            Mark all read
          </Button>
        </TopBarSlot>

        <NotificationsFeed
          notifications={notifications}
          summary={`${totalCount} notifications · ${unreadCount} unread`}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          sentinelRef={setSentinelNode}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onItemClick={markRead}
        />
      </Box>
    </>
  );
};

export default NotificationsPage;
