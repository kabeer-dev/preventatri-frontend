import {
  NotificationDeliveryStatus,
  NotificationDeliveryStatusConfig,
  NotificationTabConfig,
  NotificationType,
  NotificationTypeConfig,
} from '@/shared/interfaces/notification';

// Notifications with the same documentType that fall in the same window
// collapse into one expandable group row on the notifications page.
export const NOTIFICATION_CLUSTER_WINDOW_MINUTES = 15;

export const NOTIFICATION_TYPE_ORDER: NotificationType[] = [
  'critical',
  'high',
  'low',
];

export const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationType,
  NotificationTypeConfig
> = {
  critical: {
    label: 'Critical · Interruptive',
    hint: 'bypasses quiet hours',
    labelClassName: 'text-severity-critical-fg',
  },
  high: {
    label: 'High priority',
    hint: 'push + in-app',
    labelClassName: 'text-severity-moderate-fg',
  },
  low: {
    label: 'Low priority',
    hint: 'no sound',
    labelClassName: 'text-brand',
  },
};

export const NOTIFICATION_DELIVERY_STATUS_CONFIG: Record<
  NotificationDeliveryStatus,
  NotificationDeliveryStatusConfig
> = {
  PENDING: {label: 'Pending', className: 'text-ink-muted'},
  SENT: {label: 'Sent', className: 'text-success'},
  FAILED: {label: 'Failed', className: 'text-error'},
  BLOCKED_IN_ESCALATION_POLICY: {
    label: 'Blocked by escalation policy',
    className: 'text-warning',
  },
  NOT_IN_WORKING_HOURS: {
    label: 'Not in working hours',
    className: 'text-warning',
  },
  NOT_REQUESTED: {label: 'Not requested', className: 'text-ink-subtle'},
  DISABLED: {label: 'Disabled', className: 'text-ink-subtle'},
  NO_CONTACT: {label: 'No contact on file', className: 'text-error'},
};

export const NOTIFICATION_TABS: NotificationTabConfig[] = [
  {value: 'all', label: 'All'},
  {value: 'critical', label: 'Critical'},
  {value: 'high', label: 'High priority'},
  {value: 'low', label: 'Low priority'},
];

export const NOTIFICATION_DATE_RANGE_CONTROL = {
  panelWidth: 360,
  triggerIcon: 'mdi:calendar-outline',
  triggerHeight: 34,
  triggerIconSize: 15,
  chevronSize: 12,
} as const;

// Each preset is a fixed trailing-day window (1 = last 24 hours).
export const NOTIFICATION_DATE_RANGE_PRESETS = [
  {days: 1, label: 'Last 24 hours'},
  {days: 7, label: 'Last 7 days'},
  {days: 30, label: 'Last month'},
] as const;
