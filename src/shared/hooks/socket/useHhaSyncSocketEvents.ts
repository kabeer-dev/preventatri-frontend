'use client';

import {useEffect} from 'react';

import {useQueryClient} from '@tanstack/react-query';
import {useDispatch} from 'react-redux';
import {Socket} from 'socket.io-client';

import {HHA_SYNC_AFFECTED_QUERY_KEYS} from '@/shared/constants/reactQueryConstants';
import {SOCKET_EVENTS} from '@/shared/constants/socketEvents';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncCompletedSocketPayload} from '@/shared/interfaces/hhaSync';
import {hhaSyncActions} from '@/shared/redux/slices/hhaSync';
import {AppDispatch} from '@/shared/redux/store';
import {showToast} from '@/shared/utils/toasts';

/**
 * Reacts to an HHAeXchange run finishing.
 *
 * Only ever hears about completion, so an admin who was offline misses it. That
 * is fine: the persisted notification is the durable record and the sync-status
 * endpoint restores the button on next load.
 */
export const useHhaSyncSocketEvents = ({socket}: {socket: Socket | null}) => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const {t} = useTranslation();

  useEffect(() => {
    if (!socket) return;

    const handleHhaSyncCompleted = (payload: HhaSyncCompletedSocketPayload) => {
      // Free the control first: a stuck spinner is unrecoverable without a reload.
      dispatch(hhaSyncActions.syncFinished());

      // Targeted: a run touches these five areas and nothing else.
      HHA_SYNC_AFFECTED_QUERY_KEYS.forEach((queryKey) => {
        queryClient.invalidateQueries({queryKey: [queryKey]});
      });

      if (payload?.success) {
        showToast({
          type: 'success',
          message: t('hhaSync.completedToast'),
        });

        return;
      }

      showToast({
        type: 'error',
        message: t('hhaSync.failedToast'),
      });
    };

    socket.on(SOCKET_EVENTS.HHA_SYNC_COMPLETED, handleHhaSyncCompleted);

    return () => {
      socket.off(SOCKET_EVENTS.HHA_SYNC_COMPLETED, handleHhaSyncCompleted);
    };
  }, [socket, queryClient, dispatch, t]);
};
