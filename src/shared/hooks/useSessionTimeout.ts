'use client';

import {useEffect, useState} from 'react';

import {SESSION_TIMEOUT_REASONS} from '@/shared/constants/session';
import {resetAppState} from '@/shared/hooks/useResetAppState';
import {useSignOutMutation} from '@/shared/reactQuery/users/mutations';
import {sessionActivityManager} from '@/shared/utils/sessionActivityManager';

interface UseSessionTimeoutProps {
  isLoggedIn: boolean;
  isProtectedRoute: boolean;
}

const useSessionTimeout = ({
  isLoggedIn,
  isProtectedRoute,
}: UseSessionTimeoutProps) => {
  const {mutate: executeSignOutMutation, isPending: isSignOutPending} =
    useSignOutMutation();

  const [isSessionTimedOut, setIsSessionTimedOut] = useState(
    sessionActivityManager.getState().isTimedOut
  );

  const [sessionTimeoutReason, setSessionTimeoutReason] = useState(
    sessionActivityManager.getState().timeoutReason
  );

  useEffect(() => {
    const unsubscribe = sessionActivityManager.subscribe((sessionState) => {
      setIsSessionTimedOut(sessionState.isTimedOut);
      setSessionTimeoutReason(sessionState.timeoutReason);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      sessionActivityManager.stopWatchdog();

      return;
    }

    sessionActivityManager.startWatchdog();
    sessionActivityManager.markActivity({broadcastToTabs: false});

    return () => {
      sessionActivityManager.stopWatchdog();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (sessionTimeoutReason !== SESSION_TIMEOUT_REASONS.logout.value) return;
    if (isSignOutPending) return;

    sessionActivityManager.stopWatchdog();
    sessionActivityManager.reset();
    resetAppState();
  }, [sessionTimeoutReason, isSignOutPending]);

  const shouldShowSessionTimeoutModal =
    isProtectedRoute &&
    isSessionTimedOut &&
    (sessionTimeoutReason !== SESSION_TIMEOUT_REASONS.logout.value ||
      isSignOutPending);

  const handleSessionTimeoutLogout = () => {
    if (isSignOutPending) return;

    sessionActivityManager.stopWatchdog();
    executeSignOutMutation({});
  };

  return {
    isSessionTimedOut,
    shouldShowSessionTimeoutModal,
    isLogoutPending: isSignOutPending,
    handleSessionTimeoutLogout,
  };
};

export default useSessionTimeout;
