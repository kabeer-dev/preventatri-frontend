import Link from '@/shared/components/common/localeLink';
import {NOTIFICATION_DELIVERY_STATUS_CONFIG} from '@/shared/constants/notificationTypes';
import {NotificationRowProps} from '@/shared/interfaces/notification';
import {getNotificationRowState} from '@/shared/utils/notificationsUtils';

import NotificationRecipientLine from './NotificationRecipientLine';

const ROW_CLASS_NAME =
  'border-rule flex w-full items-start justify-between gap-4 border-t px-5 py-3.5 text-left first:border-t-0';

const INTERACTIVE_CLASS_NAME =
  'cursor-pointer transition-colors hover:bg-(--mui-palette-action-hover)';

const NotificationRow = ({
  notification,
  onClick,
  showRecipient,
  viewerId,
}: NotificationRowProps) => {
  const {title, description, isRead, smsStatus, emailStatus} = notification;

  const deliveryStatuses = [
    {channel: 'SMS', status: smsStatus},
    {channel: 'Email', status: emailStatus},
  ];

  const {href, timeLabel, isClickable, handleClick} = getNotificationRowState({
    notification,
    onClick,
  });

  const content = (
    <>
      <div className='min-w-0'>
        <p
          className={`text-ink text-sm ${isRead ? 'font-medium' : 'font-bold'}`}
        >
          {title}
        </p>
        {description && (
          <p className='text-ink-muted mt-0.5 text-xs'>{description}</p>
        )}

        {showRecipient && (
          <NotificationRecipientLine
            notification={notification}
            viewerId={viewerId}
          />
        )}

        <div className='mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]'>
          {deliveryStatuses.map(({channel, status}) => {
            const config = NOTIFICATION_DELIVERY_STATUS_CONFIG[status];

            if (!config) return null;

            return (
              <span key={channel} className='text-ink-subtle'>
                {channel}:{' '}
                <span className={`font-semibold ${config.className}`}>
                  {config.label}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <span className='text-ink-subtle shrink-0 text-xs whitespace-nowrap'>
        {timeLabel}
      </span>
    </>
  );

  // Same rules as the dropdown's NotificationItem: a row with a target is a
  // link, an unread row without one is a button that marks it read, and a read
  // row without one is inert.
  if (href) {
    return (
      <Link
        href={href}
        onClick={handleClick}
        className={`${ROW_CLASS_NAME} ${INTERACTIVE_CLASS_NAME}`}
      >
        {content}
      </Link>
    );
  }

  if (isClickable) {
    return (
      <button
        type='button'
        onClick={handleClick}
        className={`${ROW_CLASS_NAME} ${INTERACTIVE_CLASS_NAME}`}
      >
        {content}
      </button>
    );
  }

  return <div className={ROW_CLASS_NAME}>{content}</div>;
};

export default NotificationRow;
