import {z} from 'zod';

import {
  PHONE_NUMBER_MAX_LENGTH,
  PHONE_NUMBER_PATTERN,
} from '@/shared/constants/common';
import {PASSWORD_RULES} from '@/shared/constants/passwordPolicy';
import {TranslateFunction} from '@/shared/types/common';
import {isTodayOrFuture} from '@/shared/utils/dateUtils';
import {normalizePhoneNumber} from '@/shared/utils/general';

type Requirable = {required?: string};

const requireIfAsked = ({
  schema,
  required,
}: {
  schema: z.ZodString;
  required?: string;
}) => (required ? schema.min(1, required) : schema);

type PhoneNoOptions = {fieldName?: string} & Requirable;

const normalizedPhoneNo = z
  .unknown()
  .transform((value) =>
    typeof value === 'string' ? normalizePhoneNumber({value}) : value
  );

const checkedPhoneNo = ({
  t,
  fieldName,
}: {t: TranslateFunction; fieldName: string}) =>
  z
    .string()
    .max(
      PHONE_NUMBER_MAX_LENGTH,
      t('authValidation.phoneNoMax', {
        fieldName,
        limit: PHONE_NUMBER_MAX_LENGTH,
      })
    )
    .regex(
      PHONE_NUMBER_PATTERN,
      t('authValidation.phoneNoInvalid', {fieldName})
    );

const phoneNoValue = ({
  t,
  fieldName,
  required,
}: {t: TranslateFunction; fieldName: string} & Requirable) => {
  const checked = z.union([z.null(), checkedPhoneNo({t, fieldName})]);

  return required
    ? checked.refine((value) => value !== null, {error: required})
    : checked;
};

type FieldName = {fieldName: string};

type OneOfOptions = {allowed: readonly string[]} & FieldName;

const requiredString = ({t, fieldName}: {t: TranslateFunction} & FieldName) =>
  z.string().trim().min(1, t('validation.fieldRequired', {fieldName}));

const presentValue = ({t, fieldName}: {t: TranslateFunction} & FieldName) =>
  z
    .unknown()
    .refine((value) => value !== undefined && value !== null && value !== '', {
      error: t('validation.fieldRequired', {fieldName}),
    });

export const commonSchema = (t: TranslateFunction) => ({
  // 📧 Email
  email: ({
    fieldName = 'Email',
    required,
  }: {fieldName?: string} & Requirable = {}) =>
    requireIfAsked({schema: z.string().trim().toLowerCase(), required}).regex(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      t('authValidation.emailInvalid', {fieldName})
    ),

  phoneNo: ({fieldName = 'Phone No', required}: PhoneNoOptions = {}) =>
    normalizedPhoneNo.pipe(phoneNoValue({t, fieldName, required})),

  optionalPhoneNo: ({fieldName = 'Phone No'}: {fieldName?: string} = {}) =>
    normalizedPhoneNo.pipe(phoneNoValue({t, fieldName})),

  passwordWithValidation: ({required}: Requirable = {}) =>
    requireIfAsked({schema: z.string().trim(), required}).superRefine(
      (value, ctx) => {
        PASSWORD_RULES.forEach((rule) => {
          if (rule.isMet({value})) return;

          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('authValidation.passwordRuleFailed', {
              rule: t(rule.messageKey),
            }),
          });
        });
      }
    ),

  passwordWithOutValidation: ({required}: Requirable = {}) =>
    requireIfAsked({schema: z.string().trim(), required}),

  // 🧑 Name fields
  name: ({
    fieldName = 'Name',
    limit = 255,
    required,
  }: {fieldName?: string; limit?: number} & Requirable = {}) =>
    requireIfAsked({schema: z.string().trim(), required})
      .min(1, t('authValidation.nameMin', {fieldName}))
      .max(limit, t('authValidation.nameMax', {fieldName, limit})),

  // ✍️ General text (covers both short and long)
  text: ({
    fieldName = 'Text',
    limit = 255,
    required,
  }: {fieldName?: string; limit?: number} & Requirable = {}) =>
    requireIfAsked({schema: z.string().trim(), required}).max(
      limit,
      t('validation.textLong', {limit, fieldName})
    ),

  requiredString: ({fieldName}: FieldName) => requiredString({t, fieldName}),

  requiredOneOf: ({allowed, fieldName}: OneOfOptions) =>
    requiredString({t, fieldName}).refine((value) => allowed.includes(value), {
      error: t('validation.invalidOption', {fieldName}),
    }),

  optionalOneOf: ({allowed, fieldName}: OneOfOptions) =>
    z
      .string()
      .trim()
      .refine((value) => value === '' || allowed.includes(value), {
        error: t('validation.invalidOption', {fieldName}),
      })
      .optional(),

  requiredMultiSelect: ({fieldName}: FieldName) =>
    z
      .array(z.string())
      .min(1, t('validation.multiSelectRequired', {fieldName})),

  requiredValue: ({fieldName}: FieldName) => presentValue({t, fieldName}),

  requiredFutureDate: ({fieldName}: FieldName) =>
    presentValue({t, fieldName}).refine((value) => isTodayOrFuture({value}), {
      error: t('validation.mustBeTodayOrFutureDate', {fieldName}),
    }),

  optionalFutureDate: ({fieldName}: FieldName) =>
    z
      .unknown()
      .nullish()
      .refine((value) => !value || isTodayOrFuture({value}), {
        error: t('validation.mustBeTodayOrFutureDate', {fieldName}),
      }),
});

export const nameFields = (t: TranslateFunction) => ({
  firstName: commonSchema(t).name({
    fieldName: 'First Name',
    required: t('authValidation.nameRequired', {fieldName: 'First Name'}),
  }),
  lastName: commonSchema(t).name({
    fieldName: 'Last Name',
    required: t('authValidation.nameRequired', {fieldName: 'Last Name'}),
  }),
});

export const personFields = (t: TranslateFunction) => ({
  ...nameFields(t),
  email: commonSchema(t).email({
    required: t('authValidation.emailRequired', {fieldName: 'Email'}),
  }),
});

export const withMatchingPasswords = <T extends z.ZodObject<z.ZodRawShape>>({
  schema,
  t,
  passwordField = 'password',
  confirmField = 'confirmPassword',
}: {
  schema: T;
  t: TranslateFunction;
  passwordField?: string;
  confirmField?: string;
}) =>
  schema.refine(
    (values) =>
      (values as Record<string, unknown>)[passwordField] ===
      (values as Record<string, unknown>)[confirmField],
    {
      error: t('authValidation.passwordsMustMatch'),
      path: [confirmField],
    }
  );
