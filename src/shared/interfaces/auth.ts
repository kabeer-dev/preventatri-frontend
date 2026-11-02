import {ReactNode} from 'react';

import {SxProps, Theme} from '@mui/material/styles';
import {Control} from 'react-hook-form';

import {
  AuthBadgeSize,
  AuthBadgeTone,
  ForgotPasswordPayload,
  LoginPayload,
  OtpVerificationPayload,
  ResetPasswordPayload,
} from '@/shared/types/auth';
import {OtpSessionState} from '@/shared/types/redux';

import {NodeChildrenProps} from './common';

export interface LoginError {
  error?: {
    type?: string;
    email?: string;
  };
}

export interface User {
  id: string;
  name?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  address?: string;
  city?: string;
  zipCode?: string;
  language: string;
  currentActiveOrganization: any;
  profileImage?: {
    url: string;
    key: string;
  };
}

export interface MyOrganization {
  organizationId: string;
  organizationName: string;
  role: string;
  isCurrent: boolean;
  isMain: boolean;
}

export interface SwitchOrganizationResponse {
  organization?: {organizationId: string; role: string};
}

export interface LinkSentPageProps {
  params: Promise<{action: string}>;
}

export interface ResetPasswordPageProps {
  params: Promise<{token: string}>;
}

export interface AcceptInvitationPageProps {
  params: Promise<{token: string}>;
}

export interface VerifyPageProps {
  params: Promise<{token: string}>;
}

export interface VerificationMessageProps {
  title: string;
  subtitle: string;
  email?: string;
  showLoginButton?: boolean;
  showResendButton?: boolean;
}

export interface setOtpMutationConfigDataParams {
  mutation: (payload?: any) => Promise<any>;
  payload: any;
  type: string | null;
  otpRegenerateType?: string;
  extraComponentToRender?: ReactNode | null;
  callBackFuncs?: callBackFuncs;
}

export interface ExtendPayloadDataProps {
  isLogoutFromAllDevices?: boolean;
  phoneNo?: string;
}

export interface callBackFuncs {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface OTPMutationState {
  mutation:
    ((payload?: any, callBackFuncs?: callBackFuncs) => Promise<any>) | null;
  payload?: any;
  type: string | null;
  otpRegenerateType: string | null;
  extraComponentToRender?: ReactNode | null;
  callBackFuncs?: callBackFuncs;
}

export interface InitializeOtpSessionParams {
  otpToken: string;
  isEmailOtpRequired?: boolean;
  isPhoneOtpRequired?: boolean;
  shouldShowOtp?: boolean;
  sessionId?: string;
}

export interface OTPContextType {
  otpMutationConfig: OTPMutationState;
  setOtpMutationConfigData: (params: setOtpMutationConfigDataParams) => void;
  otpSession: OtpSessionState;
  initializeOtpSession: (params: InitializeOtpSessionParams) => void;
  extendPayloadData: (extraPayload: Partial<ExtendPayloadDataProps>) => void;
  clearOtpSessionAndMutationConfig: ({
    isOtpVerified,
  }: {
    isOtpVerified: boolean;
  }) => void;
  setOtpToken: ({otpToken}: {otpToken: string}) => void;
  setShouldShowOtp: ({shouldShowOtp}: {shouldShowOtp: boolean}) => void;
  isOtpVerified: boolean;
}

export interface OtpInputsProps {
  control: Control<OtpVerificationPayload>;
}

export interface AuthGuardProps extends NodeChildrenProps {
  isAuthTokenInCookies?: boolean;
}

export interface AuthCardHeaderProps {
  title: string;
  subtitle?: ReactNode;
  eyebrow?: string;
  icon?: string;
  tone?: AuthBadgeTone;
  titleId?: string;
  titleComponent?: 'h1' | 'h2';
}

export interface AuthIconBadgeProps {
  icon: string;
  tone?: AuthBadgeTone;
  size?: AuthBadgeSize;
}

export interface LinkSentResetUIProps {
  email: string;
  onResend: () => void;
}

export interface AuthComplianceTextProps {
  className?: string;
  sx?: SxProps<Theme>;
}

export interface AuthConfirmationCardProps extends Omit<
  AuthCardHeaderProps,
  'icon' | 'tone'
> {
  buttonText?: string;
  buttonHref?: string;
  backToLogin?: boolean;
}

export interface LoginFormUIProps {
  control: Control<LoginPayload>;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export interface OtpCardUIProps {
  control: Control<OtpVerificationPayload>;
  isSubmitting: boolean;
  timeLeft: number;
  otpResendTime: number;
  isRegenerateDisabled: boolean;
  isRegenerationPending: boolean;
  showGoBack: boolean;
  isModal?: boolean;
  title: string;
  eyebrow: string;
  icon: string;
  subtitle: ReactNode;
  extraComponentToRender?: ReactNode | null;
  onSubmit: (e: React.FormEvent) => void;
  onGoBack: () => void;
  onResend: () => void;
  onClose?: () => void;
}

export interface ForgotPasswordFormUIProps {
  control: Control<ForgotPasswordPayload>;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export interface ResetPasswordFormUIProps {
  control: Control<ResetPasswordPayload>;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}
