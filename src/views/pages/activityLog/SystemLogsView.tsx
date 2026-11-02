'use client';

import {useMemo} from 'react';

import Box from '@mui/material/Box';

import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useInfiniteScrollSentinel from '@/shared/hooks/useInfiniteScrollSentinel';
import useNotificationDateRange from '@/shared/hooks/useNotificationDateRange';
import useTranslation from '@/shared/hooks/useTranslation';
import {notificationQueries} from '@/shared/reactQuery';
import {flattenNotificationPages} from '@/shared/utils/notificationsUtils';
import NotificationsFeed from '@/views/pages/notifications/NotificationsFeed';

// Every notification the system sent to anyone in the organization, laid out
// like the notifications page, with each row naming who it went to, their role
// and whether they have seen it. Read-only: opening a row here never marks it
// read, since most of these belong to someone else.
const SystemLogsView = () => {
  const {t} = useTranslation();
  const {currentUser} = useGetLoggedInUser();

  const {dateRange, setDateRange} = useNotificationDateRange();

  const {useInfiniteAllNotifications} = notificationQueries();

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} =
    useInfiniteAllNotifications(dateRange);

  const setSentinelNode = useInfiniteScrollSentinel({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const notifications = useMemo(
    () => flattenNotificationPages({pages: data?.pages}),
    [data]
  );

  const totalCount = data?.pages?.[0]?.meta.count ?? notifications.length;

  return (
    <Box className='bg-surface border-rule overflow-hidden rounded-lg border'>
      <NotificationsFeed
        notifications={notifications}
        summary={t('activityLog.systemLogs.count', {count: totalCount})}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        sentinelRef={setSentinelNode}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        showRecipient
        viewerId={currentUser?.id}
      />
    </Box>
  );
};

export default SystemLogsView;
