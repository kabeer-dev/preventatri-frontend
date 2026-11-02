'use client';

import {createElement, useEffect} from 'react';

import {useDispatch, useSelector} from 'react-redux';

import HhaSyncConfirmContent from '@/shared/components/common/hhaSync/HhaSyncConfirmContent';
import {ConfirmationModal} from '@/shared/components/common/modals/ConfirmationModal';
import {HHA_SYNC_CONFIRM_MODAL_WIDTH} from '@/shared/constants/hhaSync';
import {useModal} from '@/shared/hooks/modals/useModal';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncQueuedResponse} from '@/shared/interfaces/hhaSync';
import {hhaExchangeMutations, hhaExchangeQueries} from '@/shared/reactQuery';
import {
  getIsHhaSyncRunning,
  hhaSyncActions,
} from '@/shared/redux/slices/hhaSync';
import {AppDispatch} from '@/shared/redux/store';

/**
 * Confirm-then-run flow for the HHAeXchange import.
 *
 * Resource-agnostic, like the endpoint: one run brings across every resource,
 * so the same hook backs the control on all five list pages.
 *
 * `isSyncing` tracks the RUN, not the request -- that now returns a 202 in
 * milliseconds while the run finishes minutes later on a socket event.
 */
export const useHhaSyncFlow = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const {useSyncHhaExchangeMutation} = hhaExchangeMutations();
  const {useFetchHhaSyncStatus} = hhaExchangeQueries();

  const isSyncing = useSelector(getIsHhaSyncRunning);

  const {mutate: syncHhaExchange, isPending: isRequestPending} =
    useSyncHhaExchangeMutation();

  // Asked once on mount: a run started elsewhere is invisible otherwise.
  // `data` on a useQueryHandler result is already the response body.
  const {data: syncStatus} = useFetchHhaSyncStatus();

  useEffect(() => {
    if (syncStatus?.isRunning === undefined) return;

    dispatch(
      hhaSyncActions.syncRunningResolved({
        isRunning: Boolean(syncStatus.isRunning),
      })
    );
  }, [syncStatus, dispatch]);

  const {isModalOpen, openModal, closeModal} = useModal();

  const handleSync = () => openModal();

  const confirmSync = () => {
    syncHhaExchange({
      callBackFuncs: {
        onSuccess: (response: {data?: HhaSyncQueuedResponse}) => {
          // Cleared by the socket event, never here: the request finishing
          // says nothing about the run finishing.
          dispatch(
            hhaSyncActions.syncStarted({runId: response?.data?.runId ?? null})
          );

          closeModal();
        },
      },
    });
  };

  // An element, not a component made here: a new component type on every
  // render made React remount the dialog, so it flickered and lost its fade.
  const syncConfirmationModal = createElement(ConfirmationModal, {
    isOpen: isModalOpen,
    title: t('hhaSync.confirmTitle'),
    content: createElement(HhaSyncConfirmContent),
    width: HHA_SYNC_CONFIRM_MODAL_WIDTH,
    maxWidth: false,
    confirmLabel: t('hhaSync.confirmLabel'),
    dismissLabel: t('hhaSync.cancelLabel'),
    onCancel: closeModal,
    onConfirm: confirmSync,
    confirmLoading: isSyncing || isRequestPending,
    confirmButtonColor: 'primary',
  });

  return {handleSync, isSyncing, syncConfirmationModal};
};
