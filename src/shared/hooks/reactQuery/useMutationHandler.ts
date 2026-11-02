import {useMutation} from '@tanstack/react-query';

import {MutationVariables, RequestParams} from '@/shared/interfaces/hooks';
import {RequestFunction} from '@/shared/types/reactQuery';
import {processToastConfig} from '@/shared/utils/reactQuery';
import {
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest,
} from '@/shared/utils/requests';
import {showToast} from '@/shared/utils/toasts';

import {useInvalidateAndRefetchQuery} from './useInvalidateAndRefetchQuery';

const requestFunctions: Record<RequestParams['method'], RequestFunction> = {
  POST: postRequest,
  PUT: putRequest,
  PATCH: patchRequest,
  DELETE: deleteRequest,
};

export const useMutationHandler = ({
  endpoint,
  method,
  isThirdParty = false,
  callBackFuncs = {},
  queriesToChangeAlways = {},
  toastConfigAlways = {},
}: RequestParams) => {
  const {handleQueries} = useInvalidateAndRefetchQuery();
  const {onSuccessAlways, onErrorAlways} = callBackFuncs;

  const requestFunction =
    requestFunctions[method.toUpperCase() as RequestParams['method']];

  if (!requestFunction) {
    throw new Error(
      `Invalid method: ${method}. Use POST, PUT, PATCH, or DELETE.`
    );
  }

  const mutation = useMutation<any, any, MutationVariables>({
    mutationFn: async (variables?: MutationVariables) => {
      const {payload, params, queriesToChange, callBackFuncs, toastConfig} =
        variables || {};
      const {onSuccess, onError} = callBackFuncs || {};

      const {
        showSuccessToast,
        successMessage,
        successFallbackMessage,
        showErrorToast,
        errorMessage,
        errorFallbackMessage,
      } = processToastConfig({toastConfigAlways, toastConfig});

      const apiEndpoint =
        typeof endpoint === 'function' ? endpoint(params) : endpoint;

      try {
        const response = await requestFunction({
          endpoint: apiEndpoint,
          payload,
        });

        const {body, ...rest} = response.data || {};
        const res = isThirdParty ? response.data : {data: body, ...rest}; // Return the entire body as-is for third-party configs (Stripe, etc.)

        onSuccessAlways?.(res);
        onSuccess?.(res);

        // Show success toast if configured
        if (showSuccessToast) {
          showToast({
            type: 'success',
            message: successMessage || res?.message || successFallbackMessage,
          });
        }

        // Handle queries after success
        handleQueries({queriesToChangeAlways, queriesToChange});

        return res;
      } catch (err: any) {
        if (err?._sessionTimedOut) throw err;

        const isDuplicate = !!err?._isDuplicate;

        if (isDuplicate) {
          showToast({
            type: 'error',
            message: err._idempotencyDuplicateMessage,
          });
        } else {
          onErrorAlways?.(err);
          onError?.(err);

          // Show error toast if configured
          if (showErrorToast) {
            showToast({
              type: 'error',
              message: errorMessage || err?.message || errorFallbackMessage,
            });
          }
        }

        throw err;
      }
    },
  });

  const {data, error, mutate, mutateAsync, isPending, ...rest} = mutation;

  const safeMutate = (variables?: MutationVariables) => {
    if (!isPending) mutate(variables as MutationVariables);
  };

  return {
    ...data,
    ...error,
    mutate: safeMutate, // For fire-and-forget operations
    mutateAsync, // For async/await operations
    isPending,
    ...rest,
  };
};
