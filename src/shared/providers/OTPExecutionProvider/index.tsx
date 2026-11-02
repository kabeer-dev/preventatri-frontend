'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';

import {jwtDecode} from 'jwt-decode';

import {OTP_REGENERATE_TYPE, OTP_VIEW_TYPE} from '@/shared/constants/general';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import {useOtpVerificationModal} from '@/shared/hooks/modals/useOTPVerificationModal';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import {
  ExtendPayloadDataProps,
  OTPContextType,
  OTPMutationState,
  InitializeOtpSessionParams,
  setOtpMutationConfigDataParams,
} from '@/shared/interfaces/auth';
import {setInitializeOtpSessionRef} from '@/shared/providers/OTPExecutionProvider/sessionRef';
import {OtpSessionState} from '@/shared/types/redux';

const OTPContext = createContext<OTPContextType | undefined>(undefined);

export default function OTPExecutionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useLocaleRouter();

  const {OtpVerificationModal, openModal, closeModal} =
    useOtpVerificationModal();

  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [otpSession, setOTPSession] = useState<OtpSessionState>(() => ({
    sessionId: Date.now().toString(),
    expiryTime: 0,
    otpRegenerateAllowedAfter: 0,
    otpToken: null,
    isEmailOtpRequired: true,
    isPhoneOtpRequired: true,
    shouldShowOtp: false,
  }));

  const [otpMutationConfig, setOtpMutationConfig] = useState<OTPMutationState>({
    mutation: null,
    payload: null,
    type: null,
    otpRegenerateType: null,
    extraComponentToRender: null,
    callBackFuncs: {},
  });

  useEffect(() => {
    if (
      otpSession.shouldShowOtp &&
      otpMutationConfig.type === OTP_VIEW_TYPE.page.value
    ) {
      return router.push({url: AUTH_ROUTES.otpVerification()});
    }
    if (
      otpSession.shouldShowOtp &&
      otpMutationConfig.type === OTP_VIEW_TYPE.modal.value
    ) {
      openModal();
    }
    // eslint-disable-next-line
  }, [otpSession.shouldShowOtp, otpSession.sessionId]);

  const initializeOtpSession = useCallback(
    ({
      otpToken,
      isEmailOtpRequired,
      isPhoneOtpRequired,
      shouldShowOtp,
      sessionId,
    }: InitializeOtpSessionParams) => {
      let expiryTime;
      let otpRegenerateAllowedAfter;

      // decode exp from token
      const decoded: {exp?: number; otpRegenerateAllowedAfter?: number} =
        jwtDecode(otpToken);
      if (decoded?.exp) {
        expiryTime = decoded.exp * 1000;
      } else {
        // fallback: 5 minutes from now
        expiryTime = Date.now() + 300 * 1000;
      }

      if (decoded?.otpRegenerateAllowedAfter) {
        otpRegenerateAllowedAfter = decoded.otpRegenerateAllowedAfter * 1000;
      } else {
        // fallback: 30 seconds from now
        otpRegenerateAllowedAfter = Date.now() + 30 * 1000;
      }

      setOTPSession((prev) => {
        return {
          sessionId: sessionId ?? prev.sessionId,
          otpToken,
          expiryTime,
          otpRegenerateAllowedAfter,
          isEmailOtpRequired: isEmailOtpRequired ?? prev.isEmailOtpRequired,
          isPhoneOtpRequired: isPhoneOtpRequired ?? prev.isPhoneOtpRequired,
          shouldShowOtp: shouldShowOtp ?? prev.shouldShowOtp,
        };
      });
    },
    []
  );

  const setOtpToken = useCallback(
    ({otpToken}: {otpToken: string}) => {
      initializeOtpSession({otpToken});
    },
    [initializeOtpSession]
  );

  const setShouldShowOtp = useCallback(
    ({shouldShowOtp}: {shouldShowOtp: boolean}) => {
      setOTPSession((prev) => {
        return {
          ...prev,
          shouldShowOtp,
        };
      });
    },
    []
  );

  const setOtpMutationConfigData = useCallback(
    ({
      mutation,
      payload,
      type,
      otpRegenerateType,
      extraComponentToRender = null,
      callBackFuncs = {},
    }: setOtpMutationConfigDataParams) => {
      mutation({payload, callBackFuncs});

      setOtpMutationConfig({
        mutation,
        payload,
        type,
        otpRegenerateType:
          otpRegenerateType || OTP_REGENERATE_TYPE.public.value,
        extraComponentToRender,
        callBackFuncs,
      });
    },
    []
  );

  const extendPayloadData = useCallback(
    (extraPayload: Partial<ExtendPayloadDataProps>) => {
      setOtpMutationConfig((prev: OTPMutationState) => ({
        ...prev,
        payload: prev.payload
          ? {...prev.payload, ...extraPayload}
          : {...extraPayload},
      }));
    },
    []
  );

  const clearOtpSessionAndMutationConfig = useCallback(
    ({isOtpVerified}: {isOtpVerified: boolean}) => {
      if (otpMutationConfig.type === OTP_VIEW_TYPE.modal.value) closeModal();

      setIsOtpVerified(isOtpVerified);

      setOtpMutationConfig({
        mutation: null,
        payload: null,
        type: null,
        otpRegenerateType: null,
        extraComponentToRender: null,
      });

      setOTPSession({
        sessionId: Date.now().toString(),
        expiryTime: 0,
        otpRegenerateAllowedAfter: 0,
        otpToken: null,
        isEmailOtpRequired: otpSession.isEmailOtpRequired,
        isPhoneOtpRequired: otpSession.isPhoneOtpRequired,
        shouldShowOtp: false,
      });
    },
    [
      closeModal,
      otpMutationConfig.type,
      otpSession.isEmailOtpRequired,
      otpSession.isPhoneOtpRequired,
    ]
  );

  const value: OTPContextType = {
    otpMutationConfig,
    setOtpMutationConfigData,
    otpSession,
    initializeOtpSession,
    extendPayloadData,
    clearOtpSessionAndMutationConfig,
    setOtpToken,
    setShouldShowOtp,
    isOtpVerified,
  };

  useEffect(() => {
    setInitializeOtpSessionRef({fn: initializeOtpSession});
  }, [initializeOtpSession]);

  return (
    <OTPContext.Provider value={value}>
      {OtpVerificationModal}
      {children}
    </OTPContext.Provider>
  );
}

export const useOTPContext = (): OTPContextType => {
  const context = useContext(OTPContext);
  if (!context) {
    throw new Error(
      'useOTPContext must be used within an OTPExecutionProvider'
    );
  }

  return context;
};
