import {Socket} from 'socket.io-client';

export type SocketState = {
  value: Socket | null;
};

export type AppState = {
  language: string;
};

export type OtpSessionState = {
  sessionId?: string;
  expiryTime: number;
  otpRegenerateAllowedAfter: number;
  otpToken: string | null;
  isEmailOtpRequired: boolean;
  isPhoneOtpRequired: boolean;
  shouldShowOtp: boolean;
};
