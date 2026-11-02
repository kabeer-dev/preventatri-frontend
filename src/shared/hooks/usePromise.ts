import {useCallback, useState} from 'react';

import {
  UsePromiseCallbackProps,
  UsePromiseResult,
} from '@/shared/interfaces/hooks';
import translationUtilsValues from '@/shared/utils/translationsUtils';
import {asyncTryCatch} from '@/shared/utils/tryCatchUtils';

const usePromise = <T>(): UsePromiseResult<T> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  const executePromise = useCallback(
    async ({fn, onSuccess, onError}: UsePromiseCallbackProps<T>) => {
      setIsLoading(true);

      const {
        success,
        response,
        error: errorResponse,
      } = await asyncTryCatch<T>({fn});

      if (success) {
        if (response !== undefined) {
          setData(response);
          if (onSuccess) onSuccess(response);
        } else {
          setData(null); // or handle the undefined response as needed
        }
      } else {
        const {t} = await translationUtilsValues();
        const errorObject = errorResponse || t('error.message');
        setError(errorObject);
        if (onError) onError(errorObject);
      }

      setIsLoading(false);
    },
    []
  );

  return {isLoading, data, error, executePromise};
};

export default usePromise;
