import {useCallback} from 'react';

import {useQueryClient} from '@tanstack/react-query';

import {NotificationItemOnClickPayload} from '@/shared/interfaces/notification';
import {notificationMutations} from '@/shared/reactQuery';
import {patchNotificationsCache} from '@/shared/utils/notificationsUtils';

// Optimistic mark-as-read for a clicked notification: flips it to read in every
// cached list immediately, then fires the PATCH in the background. Best-effort:
// the error toast comes from useMutationHandler and a later refetch or socket
// event reconciles state. Already-read notifications are a no-op.
export default function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const {useMarkNotificationAsRead} = notificationMutations();
  const {mutate: markAsRead} = useMarkNotificationAsRead();

  return useCallback(
    ({
      notificationId,
      isRead,
    }: Pick<NotificationItemOnClickPayload, 'notificationId' | 'isRead'>) => {
      if (isRead) return;

      patchNotificationsCache({queryClient, notificationId});
      markAsRead({params: {id: notificationId}});
    },
    [markAsRead, queryClient]
  );
}
