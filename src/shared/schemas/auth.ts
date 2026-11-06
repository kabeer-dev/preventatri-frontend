import {z} from 'zod';

import {TIME_ZONE_KEYS} from '@/shared/constants/settings';
import {TranslateFunction} from '@/shared/types/common';

import {
  commonSchema,
  nameFields,
  personFields,
  withMatchingPasswords,
} from './commonSchemaCreator';

// Matches the backend rule for POST /users/signup.
const ORGANIZATION_NAME_MIN_LENGTH = 2;
const ORGANIZATION_NAME_MAX_LENGTH = 120;

export const loginUserSchema = ({t}: {t: TranslateFunction}) => {
  const commonFieldsSchema = commonSchema(t);

  return z.object({
    email: commonFieldsSchema.email({
      required: t('authValidation.emailRequired', {fieldName: 'Email'}),
    }),
    password: commonFieldsSchema.passwordWithOutValidation({
      required: t('authValidation.passwordRequired'),
    }),
  });
};

export const registerUserSchema = ({t}: {t: TranslateFunction}) => {
  const commonFieldsSchema = commonSchema(t);

  return z.object({
    organizationName: z
      .string()
      .trim()
      .min(1, t('authValidation.organizationNameRequired'))
      .min(
        ORGANIZATION_NAME_MIN_LENGTH,
        t('authValidation.organizationNameMin', {
          limit: ORGANIZATION_NAME_MIN_LENGTH,
        })
      )
      .max(
        ORGANIZATION_NAME_MAX_LENGTH,
        t('authValidation.organizationNameMax', {
          limit: ORGANIZATION_NAME_MAX_LENGTH,
        })
      ),
    timeZone: z.enum(TIME_ZONE_KEYS, {
      error: t('authValidation.timeZoneRequired'),
    }),
    ...personFields(t),
    phoneNo: commonFieldsSchema.phoneNo({
      fieldName: 'Phone No',
      required: t('authValidation.phoneNoRequired', {fieldName: 'Phone No'}),
    }),
    password: commonFieldsSchema.passwordWithValidation({
      required: t('authValidation.passwordRequired'),
    }),
  });
};

export const sendResetPasswordLinkSchema = ({t}: {t: TranslateFunction}) => {
  const commonFieldsSchema = commonSchema(t);

  return z.object({
    email: commonFieldsSchema.email({
      required: t('authValidation.emailRequired', {fieldName: 'Email'}),
    }),
  });
};

export const acceptInvitationSchema = ({t}: {t: TranslateFunction}) => {
  const commonFieldsSchema = commonSchema(t);

  return withMatchingPasswords({
    t,
    schema: z.object({
      ...nameFields(t),
      password: commonFieldsSchema.passwordWithValidation({
        required: t('authValidation.passwordRequired'),
      }),
      confirmPassword: z
        .string()
        .trim()
        .min(1, t('authValidation.confirmPasswordRequired')),
    }),
  });
};

export const resetPasswordSchema = ({t}: {t: TranslateFunction}) => {
  const commonFieldsSchema = commonSchema(t);

  return withMatchingPasswords({
    t,
    schema: z.object({
      password: commonFieldsSchema.passwordWithValidation({
        required: t('authValidation.passwordRequired'),
      }),
      confirmPassword: z
        .string()
        .trim()
        .min(1, t('authValidation.confirmPasswordRequired')),
    }),
  });
};

const otpField = (t: TranslateFunction) =>
  z
    .string()
    .min(1, t('otpVerification.required'))
    .regex(/^[A-Za-z0-9!@#$%^&*]+$/, t('otpVerification.otpAlphaNumeric'))
    .length(8, t('otpVerification.otpLength'));

export const getValidateOtpSchema = ({
  isEmailOtpRequired,
  isPhoneOtpRequired,
  t,
}: {
  isEmailOtpRequired?: boolean;
  isPhoneOtpRequired?: boolean;
  t: TranslateFunction;
}) =>
  z.object({
    emailOtp: isEmailOtpRequired ? otpField(t) : z.string(),
    phoneOtp: isPhoneOtpRequired ? otpField(t) : z.string(),
  });
