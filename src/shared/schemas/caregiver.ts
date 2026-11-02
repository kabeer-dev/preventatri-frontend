import {z} from 'zod';

import {
  CAREGIVER_STATUS_VALUES,
  LANGUAGE_VALUES,
} from '@/shared/constants/caregivers';
import {TranslateFunction} from '@/shared/types/common';

import {commonSchema, personFields} from './commonSchemaCreator';

export const caregiverFormSchema = ({t}: {t: TranslateFunction}) => {
  const commonFieldsSchema = commonSchema(t);

  return z.object({
    // Personal Information (required)
    ...personFields(t),
    phoneNo: commonFieldsSchema.optionalPhoneNo({fieldName: 'Phone Number'}),

    // Role & Status (required)
    caregiverRole: commonFieldsSchema.requiredString({
      fieldName: 'Caregiver Role',
    }),
    status: commonFieldsSchema.requiredOneOf({
      allowed: CAREGIVER_STATUS_VALUES,
      fieldName: 'Status',
    }),

    // Additional Information (optional)
    preferredContactMethod: z.string().trim().optional(),
    relationshipToPatient: z.string().trim().optional(),
    language: commonFieldsSchema.optionalOneOf({
      allowed: LANGUAGE_VALUES,
      fieldName: 'Language',
    }),
    notes: commonFieldsSchema
      .text({fieldName: 'Notes', limit: 2000})
      .optional(),
    startDate: z.unknown().nullish(),
    terminationDate: z.unknown().nullish(),
    onCallIndicator: z.boolean().optional(),
    address: commonFieldsSchema
      .text({fieldName: 'Street Address', limit: 500})
      .optional(),
    city: commonFieldsSchema.text({fieldName: 'City', limit: 100}).optional(),
    state: commonFieldsSchema.text({fieldName: 'State', limit: 50}).optional(),
    zipCode: commonFieldsSchema
      .text({fieldName: 'Zip Code', limit: 10})
      .optional(),
  });
};
