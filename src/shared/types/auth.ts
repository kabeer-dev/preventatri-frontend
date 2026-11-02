import {z} from 'zod';

import {
  acceptInvitationSchema,
  getValidateOtpSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  sendResetPasswordLinkSchema,
} from '@/shared/schemas/auth';

export type OtpVerificationPayload = z.infer<
  ReturnType<typeof getValidateOtpSchema>
>;

export type LoginPayload = z.infer<ReturnType<typeof loginUserSchema>>;

export type RegisterPayload = z.infer<ReturnType<typeof registerUserSchema>>;

export type ForgotPasswordPayload = z.infer<
  ReturnType<typeof sendResetPasswordLinkSchema>
>;

export type ResetPasswordPayload = z.infer<
  ReturnType<typeof resetPasswordSchema>
>;

export type AcceptInvitationPayload = z.infer<
  ReturnType<typeof acceptInvitationSchema>
>;

export type AuthBadgeTone = 'brand' | 'success' | 'critical';

export type AuthBadgeSize = 'md' | 'lg';
