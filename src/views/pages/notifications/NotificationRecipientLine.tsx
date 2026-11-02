'use client';

import useTranslation from '@/shared/hooks/useTranslation';
import {NotificationRecipientLineProps} from '@/shared/interfaces/notification';
import {getFullName} from '@/shared/utils/general';
import {getNotificationTimeLabel} from '@/shared/utils/notificationsUtils';
import {getRoleLabel} from '@/shared/utils/workItemUtils';

// Who a notification went to, in which role, and whether they have opened it.
// Shown only where the list covers every user's notifications.
const NotificationRecipientLine = ({
  notification,
  viewerId,
}: NotificationRecipientLineProps) => {
  const {t} = useTranslation();

  const {recipient, isRead, readAt} = notification;

  const name =
    getFullName({
      firstName: recipient?.firstName,
      lastName: recipient?.lastName,
    }) || t('activityLog.systemLogs.unknownRecipient');

  const role = getRoleLabel({role: recipient?.role});

  const isViewer = Boolean(viewerId && recipient?.id === viewerId);

  // A row marked read before read times were recorded has no time to state.
  const seenLabel = readAt
    ? t('activityLog.systemLogs.seenAt', {
        time: getNotificationTimeLabel({createdAt: readAt}),
      })
    : t('activityLog.systemLogs.seen');

  return (
    <div className='mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]'>
      <span className='text-ink-subtle'>
        {t('activityLog.systemLogs.sentTo')}{' '}
        <span className='text-ink font-semibold'>{name}</span>
        {role && ` · ${role}`}
      </span>

      {isViewer && (
        <span className='bg-brand-tint text-brand rounded px-1.5 font-semibold'>
          {t('activityLog.systemLogs.you')}
        </span>
      )}

      <span
        className={`font-semibold ${isRead ? 'text-success' : 'text-ink-muted'}`}
      >
        {isRead ? seenLabel : t('activityLog.systemLogs.notSeen')}
      </span>
    </div>
  );
};

export default NotificationRecipientLine;
