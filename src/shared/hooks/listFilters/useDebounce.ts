import {useEffect, useState} from 'react';

import {UseDebounceParams} from '@/shared/interfaces/hooks';

export default function useDebounce<T>({
  value,
  delay = 500,
}: UseDebounceParams<T>) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
