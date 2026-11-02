import {useEffect, useState} from 'react';

import {UseElapsedTimeProps} from '@/shared/interfaces/hooks';
import {formatElapsed, secondsSinceIso} from '@/shared/utils/dateUtils';

export function useElapsedTime({since}: UseElapsedTimeProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((tick) => tick + 1), 1000);

    return () => clearInterval(interval);
  }, []);

  const seconds = secondsSinceIso({iso: since});

  return {seconds, formatted: formatElapsed({seconds})};
}
