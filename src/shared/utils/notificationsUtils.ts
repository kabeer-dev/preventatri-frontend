import {InfiniteData, QueryClient} from '@tanstack/react-query';

import {RECENT_ACTIVITY} from '@/shared/constants/dashboard';
import {
  FALLBACK_NOTIFICATION_ICON,
  NOTIFICATION_ROUTE_BUILDERS,
  NOTIFICATION_TITLE_ICON_RULES,
  NOTIFICATION_TYPE_ICONS,
} from '@/shared/constants/notifications';
import {NOTIFICATION_CLUSTER_WINDOW_MINUTES} from '@/shared/constants/notificationTypes';
import {NOTIFICATIONS} from '@/shared/constants/reactQueryConstants';
import {
  Notification,
  NotificationCluster,
  NotificationClusterSummary,
  NotificationDayGroup,
  NotificationItemOnClickPayload,
  NotificationRowState,
  NotificationsPage,
  NotificationType,
  NotificationTypeGroup,
} from '@/shared/interfaces/notification';
import {DateTime, formatDate, groupByDay} from '@/shared/utils/dateUtils';

export const patchNotificationsCache = ({
  queryClient,
  notificationId,
  unreadCount,
}: {
  queryClient: QueryClient;
  notificationId?: string;
  unreadCount?: number;
}) => {
  // Prefix match: the list is cached per date range
  // ([queryKey, startDate, endDate]), and the page and dropdown each hold their
  // own entry, so every one of them has to be patched.
  queryClient.setQueriesData<InfiniteData<NotificationsPage>>(
    {queryKey: [NOTIFICATIONS.fetchNotifications.queryKey]},
    (oldData) => {
      if (!oldData) return oldData;

      // Single read (notificationId given) → flip only that notification;
      // mark-all (no id) → flip every still-unread one.
      const shouldMarkRead = (notification: Notification) =>
        notificationId
          ? notification.id === notificationId
          : !notification.isRead;

      // Object.assign (not spread, per the no-spread rule) preserves any future
      // page / InfiniteData fields while overriding only what changed.
      const pages = oldData.pages.map((page, pageIndex) =>
        Object.assign({}, page, {
          data: page.data.map((notification) =>
            shouldMarkRead(notification)
              ? Object.assign({}, notification, {isRead: true})
              : notification
          ),
          unreadCount:
            unreadCount ??
            Math.max(
              0,
              (page.unreadCount ?? 0) -
                (pageIndex === 0 && notificationId ? 1 : 0)
            ),
        })
      );

      return Object.assign({}, oldData, {pages});
    }
  );
};

// The details page a notification links to, or undefined when it has no
// routing target (e.g. a system notice).
export const getNotificationHref = ({
  documentType,
  documentId,
}: Pick<Notification, 'documentType' | 'documentId'>) =>
  documentType && documentId
    ? NOTIFICATION_ROUTE_BUILDERS[documentType]?.(documentId)
    : undefined;

// Leading badge icon/tint. Match the title first — it carries the flag shade
// (red vs yellow) that documentType can't, and the templated titles map
// cleanly to each category. Fall back to documentType, then a neutral bell.
export const getNotificationIcon = ({
  title,
  documentType,
}: Pick<Notification, 'title' | 'documentType'>) =>
  NOTIFICATION_TITLE_ICON_RULES.find(({match}) => match.test(title)) ||
  (documentType && NOTIFICATION_TYPE_ICONS[documentType]) ||
  FALLBACK_NOTIFICATION_ICON;

// Newest first, so a cluster's first item is the one its summary row shows.
export const sortNotificationsNewestFirst = ({
  notifications,
}: {
  notifications: Notification[];
}) =>
  [...notifications].sort(
    (a, b) =>
      DateTime.fromISO(b.createdAt).toMillis() -
      DateTime.fromISO(a.createdAt).toMillis()
  );

// Flatten the loaded infinite-query pages into one list, deduped by id: a
// socket-prepended notification shifts offset-pagination page boundaries, so
// the next page can re-return an item already shown.
export const flattenNotificationPages = ({
  pages = [],
}: {
  pages?: NotificationsPage[];
}): Notification[] =>
  Array.from(
    pages
      .reduce<Map<string, Notification>>((acc, page) => {
        page.data.forEach((notification) => {
          if (!acc.has(notification.id)) acc.set(notification.id, notification);
        });

        return acc;
      }, new Map<string, Notification>())
      .values()
  );

export const getNotificationTimeLabel = ({createdAt}: {createdAt: string}) =>
  DateTime.fromISO(createdAt).toRelative() ?? '';

// Summary shown on a cluster's collapsed row: its items newest first, the
// latest one (whose title/description/time the row shows), and whether any
// item is still unread.
export const summarizeNotificationCluster = ({
  items,
}: {
  items: Notification[];
}): NotificationClusterSummary => {
  const sortedItems = sortNotificationsNewestFirst({notifications: items});
  const [latest] = sortedItems;

  return {
    sortedItems,
    latest,
    hasUnread: items.some((item) => !item.isRead),
    timeLabel: getNotificationTimeLabel({createdAt: latest.createdAt}),
  };
};

// Shared click behaviour for a single notification row (page and dropdown):
// interactive when there's a click handler and clicking would actually do
// something — navigate (has a target) OR mark it read (still unread). A read
// notification with no target is inert.
export const getNotificationRowState = ({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick?: (payload: NotificationItemOnClickPayload) => void;
}): NotificationRowState => {
  const {id, isRead, createdAt, documentType, documentId} = notification;
  const href = getNotificationHref({documentType, documentId});

  return {
    href,
    timeLabel: getNotificationTimeLabel({createdAt}),
    isClickable: Boolean(onClick && (href || !isRead)),
    handleClick: () =>
      onClick?.({documentType, documentId, notificationId: id, isRead}),
  };
};

// Same documentType within the same NOTIFICATION_CLUSTER_WINDOW_MINUTES
// window collapses into one cluster, so a burst of related notifications
// (e.g. a flag updated several times back to back) shows as a single
// expandable row instead of flooding the list.
export const groupNotificationsByCluster = ({
  notifications,
}: {
  notifications: Notification[];
}): NotificationCluster[] => {
  const clusters: NotificationCluster[] = [];
  const windowMs = NOTIFICATION_CLUSTER_WINDOW_MINUTES * 60 * 1000;

  notifications.forEach((notification) => {
    const key = notification.documentType
      ? `${notification.documentType}-${Math.floor(
          DateTime.fromISO(notification.createdAt).toMillis() / windowMs
        )}`
      : `single-${notification.id}`;

    const existing = clusters.find((cluster) => cluster.key === key);

    if (existing) {
      existing.items.push(notification);

      return;
    }

    clusters.push({key, items: [notification]});
  });

  return clusters;
};

// Section per notification type (in the given order), each split into
// clusters; types with nothing to show are dropped.
export const groupNotificationsByTypeAndCluster = ({
  notifications,
  types,
}: {
  notifications: Notification[];
  types: NotificationType[];
}): NotificationTypeGroup[] =>
  types
    .map((type) => ({
      type,
      clusters: groupNotificationsByCluster({
        notifications: notifications.filter((item) => item.type === type),
      }),
    }))
    .filter((group) => group.clusters.length > 0);

export const groupNotificationsByDay = ({
  notifications,
}: {
  notifications: Notification[];
}): NotificationDayGroup[] =>
  groupByDay({
    items: notifications,
    getDate: ({item}) => item.createdAt,
    labelDay: ({date}) => formatDate({date, format: RECENT_ACTIVITY.dayFormat}),
  }).map(({label, items}) => ({day: label, items}));
