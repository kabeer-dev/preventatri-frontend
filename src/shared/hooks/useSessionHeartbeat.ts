'use client';

import {useEffect, useRef} from 'react';

import appConfig from '@/configs/appConfig';

interface UseSessionHeartbeatProps {
  isLoggedIn: boolean;
  refetch: () => void;
}

const useSessionHeartbeat = ({
  isLoggedIn,
  refetch,
}: UseSessionHeartbeatProps) => {
  const lastInputRef = useRef(0);
  const lastHeartbeatRef = useRef(0);

  useEffect(() => {
    if (!isLoggedIn) return;

    const onUserInput = () => {
      lastInputRef.current = Date.now();
    };

    window.addEventListener('mousemove', onUserInput);
    window.addEventListener('keydown', onUserInput);
    window.addEventListener('scroll', onUserInput);
    window.addEventListener('pointerdown', onUserInput);

    const interval = setInterval(() => {
      const now = Date.now();
      const hasNewInput = lastInputRef.current > lastHeartbeatRef.current;

      const heartbeatDue =
        now - lastHeartbeatRef.current >= appConfig.sessionHeartbeatIntervalMs;

      if (hasNewInput && heartbeatDue) {
        lastHeartbeatRef.current = now;
        refetch();
      }
    }, appConfig.sessionWatchdogIntervalMs);

    return () => {
      window.removeEventListener('mousemove', onUserInput);
      window.removeEventListener('keydown', onUserInput);
      window.removeEventListener('scroll', onUserInput);
      window.removeEventListener('pointerdown', onUserInput);
      clearInterval(interval);
    };
  }, [isLoggedIn, refetch]);
};

export default useSessionHeartbeat;
