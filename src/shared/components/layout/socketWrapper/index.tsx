'use client';

import {useEffect} from 'react';

import {InfiniteData, useQueryClient} from '@tanstack/react-query';
import {useDispatch, useSelector} from 'react-redux';

import {
  FLAGS,
  NOTIFICATIONS,
  EMERGENCY_FLAGS,
} from '@/shared/constants/reactQueryConstants';
import {SOCKET_EVENTS} from '@/shared/constants/socketEvents';
import {useHhaSyncSocketEvents} from '@/shared/hooks/socket/useHhaSyncSocketEvents';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import {NodeChildrenProps} from '@/shared/interfaces/common';
import {
  NotificationNewSocketPayload,
  NotificationsPage,
} from '@/shared/interfaces/notification';
import {getSocket, setSocket} from '@/shared/redux/slices/socket';
import {AppDispatch} from '@/shared/redux/store';

export default function SocketWrapper({children}: NodeChildrenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSelector(getSocket);
  const {isLoggedIn, currentUser} = useGetLoggedInUser({enabled: false});

  const activeOrganizationId =
    currentUser?.currentActiveOrganization?.organizationId;

  const queryClient = useQueryClient();

  // Safe only because the cleanup below unregisters by handler reference.
  useHhaSyncSocketEvents({socket});

  useEffect(() => {
    if (isLoggedIn) dispatch(setSocket());
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (!socket) return;

    // The payload is an informational one-field bell ({message: string}) — the
    // backend always sends it (see backend escalationUtils). Recipients don't
    // read details off the socket; they re-fetch the active-flags list.
    const RedFlagNotification = (payload: Record<string, unknown>) => {
      const {message} = payload;

      if (typeof message !== 'string') return;

      // Refresh both flag views: the dashboard active-flags query AND the
      // renamed Emergency Flags list (post red-flag→emergency-flag rename). The
      // socket previously only invalidated the active-flags key, so the
      // Emergency Flags table stopped refreshing on escalation/assignment.
      queryClient.invalidateQueries({
        queryKey: [FLAGS.fetchActiveFlags.queryKey],
      });

      queryClient.invalidateQueries({
        queryKey: [EMERGENCY_FLAGS.fetchEmergencyFlagsList.queryKey],
      });
    };

    // A new notification arrives with its full payload plus the recipient's
    // server-computed unread total, so we prepend it into the cached infinite
    // list instead of refetching. The dropdown's useInfiniteNotifications reads
    // from this same cache.
    const NotificationNew = (payload: NotificationNewSocketPayload) => {
      const {notification, totalUnreadCount, organizationId} = payload || {};

      if (!notification?.id) return;

      // A person in several organizations receives every organization's
      // pushes on one socket; only the active organization's belong here.
      if (
        organizationId &&
        activeOrganizationId &&
        organizationId !== activeOrganizationId
      ) {
        return;
      }

      queryClient.setQueryData<InfiniteData<NotificationsPage>>(
        [NOTIFICATIONS.fetchNotifications.queryKey],
        (oldData) => {
          // Cache may be empty if the dropdown was never opened; leave it so
          // the query fetches fresh on next mount.
          if (!oldData || oldData.pages.length === 0) return oldData;

          // Skip if it is already present (e.g. duplicate socket delivery).
          const alreadyExists = oldData.pages.some((page) =>
            page.data.some((item) => item.id === notification.id)
          );

          if (alreadyExists) return oldData;

          const firstPage = oldData.pages[0];

          const updatedFirstPage: NotificationsPage = {
            data: [notification].concat(firstPage.data),
            meta: firstPage.meta,

            // Server-computed total: keeps the badge correct even if pushes
            // were missed while disconnected.
            unreadCount: totalUnreadCount ?? (firstPage.unreadCount ?? 0) + 1,
          };

          return {
            pages: [updatedFirstPage].concat(oldData.pages.slice(1)),
            pageParams: oldData.pageParams,
          };
        }
      );
    };

    socket.on(SOCKET_EVENTS.ESCALATION_RED_FLAG, RedFlagNotification);
    socket.on(SOCKET_EVENTS.ASSIGNED_RED_FLAG, RedFlagNotification);
    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, NotificationNew);

    return () => {
      // No socket.offAny(): it removed every listener on the socket, including
      // other hooks'. The targeted off() calls below are enough.
      socket.off(SOCKET_EVENTS.ESCALATION_RED_FLAG, RedFlagNotification);
      socket.off(SOCKET_EVENTS.ASSIGNED_RED_FLAG, RedFlagNotification);
      socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, NotificationNew);
    };
  }, [socket, queryClient, activeOrganizationId]);

  return children;
}
