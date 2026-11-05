import {z} from 'zod';

import {TranslateFunction} from '@/shared/types/common';

import {
  commonSchema,
  nameFields,
  withMatchingPasswords,
} from './commonSchemaCreator';

export const personalDetailsSchema = ({t}: {t: TranslateFunction}) =>
  z.object({
    ...nameFields(t),
    email: commonSchema(t).email({fieldName: 'Email'}),
    phoneNo: commonSchema(t).phoneNo({fieldName: 'Phone No'}),
    address: commonSchema(t).text({fieldName: 'Address', limit: 500}),
    city: commonSchema(t).text({fieldName: 'City'}),
    zipCode: commonSchema(t).text({fieldName: 'Zip Code', limit: 10}),
  });

// The secret and key are opaque values, so they are sent exactly as typed.
export const hhaCredentialsSchema = ({t}: {t: TranslateFunction}) =>
  z.object({
    appName: commonSchema(t).text({fieldName: t('hhaCredentials.appName')}),
    appSecret: z.string().max(
      255,
      t('validation.textLong', {
        limit: 255,
        fieldName: t('hhaCredentials.appSecret'),
      })
    ),
    appKey: z.string().max(
      255,
      t('validation.textLong', {
        limit: 255,
        fieldName: t('hhaCredentials.appKey'),
      })
    ),
  });

export const passwordUpdateSchema = ({t}: {t: TranslateFunction}) =>
  withMatchingPasswords({
    t,
    passwordField: 'newPassword',
    schema: z.object({
      currentPassword: commonSchema(t).passwordWithOutValidation({
        required: t('authValidation.passwordRequired'),
      }),
      newPassword: commonSchema(t).passwordWithValidation({
        required: t('authValidation.newPasswordRequired'),
      }),
      confirmPassword: z.string().trim(),
    }),
  });
