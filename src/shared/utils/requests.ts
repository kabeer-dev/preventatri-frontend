import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

import {GENERAL_ERRORS_TYPES} from '@/shared/constants/responses/errors/general';
import {USER_ERRORS_TYPES} from '@/shared/constants/responses/errors/users';
import {USER_SUCCESS_TYPES} from '@/shared/constants/responses/success/users';
import {RequestParams, ServerRequestParams} from '@/shared/interfaces/utils';
import {getInitializeOtpSessionRef} from '@/shared/providers/OTPExecutionProvider/sessionRef';

import {sessionActivityManager} from './sessionActivityManager';
import {withSubRouteParam} from './subRouteRefetch';
import translationUtilsValues from './translationsUtils';

export const API_SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`;

// Create axios instance
const request = axios.create({
  baseURL: API_SERVER_URL,
  withCredentials: true,
  headers: {
    'x-platform': 'web',
  },
});

request.interceptors.response.use(
  (response) => {
    const isBrowser = typeof window !== 'undefined';
    const responseType = response.data?.body?.type;

    // Check if response has OTP required type in success case
    if (responseType === USER_ERRORS_TYPES.otpRequired.value) {
      const {OTPsRequired, token} = response.data.body;
      const initializeOtpSessionRef = getInitializeOtpSessionRef();

      if (initializeOtpSessionRef) {
        initializeOtpSessionRef({
          otpToken: token,
          isEmailOtpRequired: OTPsRequired.email,
          isPhoneOtpRequired: OTPsRequired.phone,
          shouldShowOtp: true,
          sessionId: Date.now().toString(),
        });
      }
    }

    if (isBrowser) {
      if (responseType === USER_SUCCESS_TYPES.userLoggedInSuccessfully.value) {
        sessionActivityManager.reset();
        sessionActivityManager.markLogin();
      }

      sessionActivityManager.markActivity();
    }

    return response;
  },
  async (error) => {
    const isBrowser = typeof window !== 'undefined';
    const errorData = error?.response?.data;
    const errorType = errorData?.error?.type;
    const idempotencyDuplicateMessage = errorData?.message;

    // 1. Handle token invalidation (skip on auth pages to prevent reload loops)

    const isInvalidToken =
      errorType === GENERAL_ERRORS_TYPES.invalidToken.value;

    const isAuthPage = isBrowser
      ? window.location.pathname.includes('/auth/')
      : false;

    if (isBrowser && isInvalidToken && !isAuthPage) {
      sessionActivityManager.markExpiredByServer();

      const timeoutError =
        typeof errorData === 'object' && errorData !== null
          ? {...errorData, _sessionTimedOut: true}
          : {_sessionTimedOut: true};

      return Promise.reject(timeoutError);
    }

    // 2. Handle idempotency duplicate request
    // Mark duplicate requests with custom flags (_isDuplicate, _idempotencyDuplicateMessage)
    // so they can be handled differently in the UI (underscore prefix prevents property conflicts)
    if (errorType === GENERAL_ERRORS_TYPES.idempotencyRequest.value) {
      const customError = error;
      customError._isDuplicate = true;
      customError._idempotencyDuplicateMessage = idempotencyDuplicateMessage;

      return Promise.reject(customError);
    }

    // 3. Default translation
    const {t} = await translationUtilsValues();
    const errorMessage = errorData || t('errorResponse.message');

    return Promise.reject(errorMessage);
  }
);

// Post request Call
export const postRequest = async <T = unknown>({
  endpoint,
  payload,
}: RequestParams): Promise<AxiosResponse<T>> => {
  const response = await request.post<T>(endpoint, payload);

  return response;
};

// Get request Call
export const getRequest = async <T = unknown>({
  endpoint,
  isSubRoute,
}: RequestParams): Promise<AxiosResponse<T>> => {
  const response = await request.get<T>(
    withSubRouteParam({endpoint, isSubRoute})
  );

  return response;
};

// Put request Call
export const putRequest = async <T = unknown>({
  endpoint,
  payload,
}: RequestParams): Promise<AxiosResponse<T>> => {
  const response = await request.put<T>(endpoint, payload);

  return response;
};

// Patch request Call
export const patchRequest = async <T = unknown>({
  endpoint,
  payload,
}: RequestParams): Promise<AxiosResponse<T>> => {
  const response = await request.patch<T>(endpoint, payload);

  return response;
};

// Delete Request Call
export const deleteRequest = async <T = unknown>({
  endpoint,
}: RequestParams): Promise<AxiosResponse<T>> => {
  const response = await request.delete<T>(endpoint);

  return response;
};

export async function getServerRequest<T = unknown>({
  endpoint,
  cookieHeader,
}: ServerRequestParams): Promise<AxiosResponse<T>> {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieHeader, // Always pass the cookie header
      },
    };

    const response = await request.get<T>(endpoint, config);

    return response;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Failed to fetch');
    }
  }
}
