import {useEffect, useState} from 'react';

const DEFAULT_TICK_INTERVAL_MS = 1_000;

// Current time in epoch millis, re-rendering every `intervalMs` so live clocks
// (e.g. the time zone's local time) keep ticking.
export default function useNowTick({
  intervalMs = DEFAULT_TICK_INTERVAL_MS,
}: {intervalMs?: number} = {}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), intervalMs);

    return () => clearInterval(intervalId);
  }, [intervalMs]);

  return now;
}
