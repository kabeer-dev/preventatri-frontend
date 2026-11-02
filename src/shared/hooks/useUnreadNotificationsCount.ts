import {notificationQueries} from '@/shared/reactQuery';

const useUnreadNotificationsCount = () => {
  const {useInfiniteNotifications} = notificationQueries();
  const {data} = useInfiniteNotifications({});

  return data?.pages?.[0]?.unreadCount ?? 0;
};

export default useUnreadNotificationsCount;
