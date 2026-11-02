import {z} from 'zod';

import {
  ACTIVE_STATUS_VALUES,
  PREFERRED_CONTACT_VALUES,
  SYSTEM_ROLES,
} from '@/shared/constants/common';
import {
  PROFESSIONAL_ROLE_VALUES,
  LICENSE_STATE_VALUES,
} from '@/shared/constants/nurses';
import {TranslateFunction} from '@/shared/types/common';
import {getCurrentDate} from '@/shared/utils/dateUtils';

import {commonSchema, personFields} from './commonSchemaCreator';

export const nurseFormSchema = ({
  t,
  isEditMode = false,
  isHhaManaged = false,
}: {
  t: TranslateFunction;
  isEditMode?: boolean;
  isHhaManaged?: boolean;
}) => {
  const commonFieldsSchema = commonSchema(t);

  return z.object({
    // Personal Information (required)
    ...personFields(t),
    phoneNo: commonFieldsSchema.optionalPhoneNo({fieldName: 'Phone Number'}),

    // Role (hidden, always 'nurse')
    role: z.literal(SYSTEM_ROLES.nurse.value).default(SYSTEM_ROLES.nurse.value),

    // Professional Information (required)
    professionalRole: commonFieldsSchema.requiredOneOf({
      allowed: PROFESSIONAL_ROLE_VALUES,
      fieldName: 'Professional Role',
    }),
    licenseNumber: isHhaManaged
      ? commonFieldsSchema
          .text({fieldName: 'License Number', limit: 50})
          .optional()
      : commonFieldsSchema.text({
          fieldName: 'License Number',
          limit: 50,
          required: t('validation.fieldRequired', {
            fieldName: 'License Number',
          }),
        }),
    licenseState: commonFieldsSchema.requiredOneOf({
      allowed: LICENSE_STATE_VALUES,
      fieldName: 'License State',
    }),

    // `z.coerce.date()` is `new Date(value)`, and `new Date(null)` is a valid
    // 1970-01-01 rather than an error, so the presence check has to run before
    // the coercion or a cleared picker happily saves the epoch.
    //
    // In edit mode past dates are allowed, since the nurse may already hold an
    // expired license.
    licenseExpirationDate: isHhaManaged
      ? z.unknown().nullish()
      : commonFieldsSchema
          .requiredValue({fieldName: 'License Expiration Date'})
          .pipe(
            isEditMode
              ? z.coerce.date()
              : z.coerce.date().refine((date) => date >= getCurrentDate(), {
                  error: t('validation.mustBeFutureDate', {
                    fieldName: 'License Expiration Date',
                  }),
                })
          ),

    // Professional Information (optional)
    npi: z
      .string()
      .refine((value) => value === '' || /^\d{10}$/.test(value), {
        error: t('validation.npiFormat'),
      })
      .optional(),

    // Assignment & Status (required)
    primaryRegionIds: commonFieldsSchema.requiredMultiSelect({
      fieldName: 'Primary Regions',
    }),
    secondaryRegionIds: commonFieldsSchema.requiredMultiSelect({
      fieldName: 'Secondary Regions',
    }),
    status: commonFieldsSchema.requiredOneOf({
      allowed: ACTIVE_STATUS_VALUES,
      fieldName: 'Status',
    }),

    // Assignment & Status (optional)
    onCallIndicator: z.boolean().optional(),
    preferredContactMethod: commonFieldsSchema.optionalOneOf({
      allowed: PREFERRED_CONTACT_VALUES,
      fieldName: 'Preferred Contact Method',
    }),
    joiningDate: z.coerce.date().nullish(),
    address: commonFieldsSchema
      .text({fieldName: 'Street Address', limit: 500})
      .optional(),
    city: commonFieldsSchema.text({fieldName: 'City', limit: 100}).optional(),
    state: commonFieldsSchema.text({fieldName: 'State', limit: 50}).optional(),
    zipCode: commonFieldsSchema
      .text({fieldName: 'Zip Code', limit: 10})
      .optional(),
    notes: commonFieldsSchema
      .text({fieldName: 'Notes', limit: 2000})
      .optional(),
  });
};
