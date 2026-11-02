export type NotificationPerformerType = 'USER' | 'SYSTEM';

export type NotificationDocumentType =
  'FLAG' | 'FOLLOWUPTASK' | 'SUPERVISORYVISIT';

// Outcome of an external channel (email / SMS) for a notification.
export type NotificationDeliveryStatus =
  | 'PENDING'
  | 'SENT'
  | 'FAILED'
  | 'BLOCKED_IN_ESCALATION_POLICY'
  | 'NOT_IN_WORKING_HOURS'
  | 'NOT_REQUESTED'
  | 'DISABLED'
  | 'NO_CONTACT';

export interface NotificationDeliveryStatusConfig {
  label: string;
  className: string;
}

export interface NotificationPerformer {
  firstName: string;
  lastName: string;
}

// Who a notification was sent to, with their role in the organization.
export interface NotificationRecipient {
  id: string;
  firstName: string | null;
  lastName: string | null;
  role?: string | null;
}

export interface Notification {
  id: string;
  title: string;
  description: string | null;
  type: NotificationType;
  documentType: NotificationDocumentType | null;
  documentId: string | null;
  isRead: boolean;
  readAt: string | null;
  emailStatus: NotificationDeliveryStatus;
  smsStatus: NotificationDeliveryStatus;
  performerType: NotificationPerformerType;
  performedBy: NotificationPerformer | null;
  createdAt: string;
  updatedAt: string;

  // Sent only by the admin's all-notifications read; the viewer's own list
  // omits it, since every row there is theirs.
  recipient?: NotificationRecipient | null;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  count: number;
  totalPages: number;
}

export interface NotificationsPage {
  data: Notification[];
  meta: NotificationMeta;

  // The viewer's own unread total; the all-notifications read has none.
  unreadCount?: number;
}

export type NotificationType = 'critical' | 'high' | 'low';

export type NotificationTypeFilter = 'all' | NotificationType;

export interface NotificationTypeConfig {
  label: string;
  hint: string;
  labelClassName: string;
}

export interface NotificationTabConfig {
  value: NotificationTypeFilter;
  label: string;
}

export interface NotificationItemOnClickPayload {
  documentType: NotificationDocumentType | null;
  documentId: string | null;
  notificationId: string;
  isRead: boolean;
}

// How a list of every user's notifications names each row's recipient.
export interface NotificationRecipientDisplay {
  showRecipient?: boolean;

  // The signed-in user, so their own rows are marked as theirs.
  viewerId?: string;
}

export interface NotificationRowProps extends NotificationRecipientDisplay {
  notification: Notification;
  onClick?: (payload: NotificationItemOnClickPayload) => void;
}

export interface NotificationGroupRowProps extends NotificationRecipientDisplay {
  items: Notification[];
  isExpanded: boolean;
  onToggle: () => void;
  onItemClick?: (payload: NotificationItemOnClickPayload) => void;
}

// The list both the notifications page and the system logs render: type tabs,
// the date range, then notifications sectioned by type and clustered.
export interface NotificationsFeedProps extends NotificationRecipientDisplay {
  notifications: Notification[];
  summary: string;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  sentinelRef: (node: HTMLDivElement | null) => void;
  dateRange: NotificationDateRange;
  onDateRangeChange: (range: NotificationDateRange) => void;
  onItemClick?: (payload: NotificationItemOnClickPayload) => void;
}

export interface NotificationDateRange {
  startDate: string;
  endDate: string;
}

export interface NotificationRecipientLineProps {
  notification: Pick<Notification, 'recipient' | 'isRead' | 'readAt'>;
  viewerId?: string;
}

export interface NotificationLeadingBadgeProps {
  notification: Pick<Notification, 'title' | 'documentType'>;
  showUnreadDot: boolean;
}

export interface NotificationGroupItemProps {
  items: Notification[];
  isExpanded: boolean;
  onToggle: () => void;
  onItemClick?: (payload: NotificationItemOnClickPayload) => void;
}

export interface NotificationItemProps {
  notification: Notification;
  onClick?: (payload: NotificationItemOnClickPayload) => void;
}

// Wire shape of the backend `notification:new` socket event: the freshly
// created notification plus the recipient's server-computed unread total.
export interface NotificationNewSocketPayload {
  organizationId?: string;
  totalUnreadCount: number;
  notification: Notification;
}

export interface FetchNotificationsQueryFnArg {
  pageParam: unknown;
}

// Wire shape of the notifications list endpoint response body. The
// all-notifications read sends no unread total.
export interface NotificationsResponseBody {
  notifications: Notification[];
  meta: NotificationMeta;
  unreadCount?: number;
}

// A notifications list endpoint paired with the key its pages are cached under.
export interface NotificationsListSource {
  queryKey: string;
  endpoint: ({params}: {params: NotificationsListParams}) => string;
}

export interface NotificationsAxiosResponse {
  body: NotificationsResponseBody;
}

export interface UseInfiniteNotificationsProps {
  enabled?: boolean;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface NotificationsListParams {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
}

export interface NotificationDayGroup {
  day: string;
  items: Notification[];
}

// A run of notifications that share a documentType and fall within the same
// minute — collapsed to a single expandable row in the notifications list.
export interface NotificationTypeGroup {
  type: NotificationType;
  clusters: NotificationCluster[];
}

export interface NotificationClusterSummary {
  sortedItems: Notification[];
  latest: Notification;
  hasUnread: boolean;
  timeLabel: string;
}

export interface NotificationRowState {
  href?: string;
  timeLabel: string;
  isClickable: boolean;
  handleClick: () => void;
}

export interface NotificationCluster {
  key: string;
  items: Notification[];
}
