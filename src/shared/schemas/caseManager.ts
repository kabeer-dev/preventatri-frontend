import {z} from 'zod';

import {LANGUAGE_OPTIONS} from '@/shared/constants/caregivers';
import {
  ACTIVE_STATUS_VALUES,
  PREFERRED_CONTACT_VALUES,
} from '@/shared/constants/common';
import {TranslateFunction} from '@/shared/types/common';

import {commonSchema, personFields} from './commonSchemaCreator';

const LANGUAGE_VALUES = LANGUAGE_OPTIONS.map(({value}) => value);

export const caseManagerFormSchema = ({
  t,
  isEdit = false,
}: {
  t: TranslateFunction;
  isEdit?: boolean;
}) => {
  const commonFieldsSchema = commonSchema(t);

  return z.object({
    // Personal Information (required)
    ...personFields(t),
    phoneNo: commonFieldsSchema.optionalPhoneNo({fieldName: 'Phone Number'}),

    // Assignment & Status (required)
    regionIds: commonFieldsSchema.requiredMultiSelect({
      fieldName: 'Assigned Regions',
    }),
    status: commonFieldsSchema.requiredOneOf({
      allowed: ACTIVE_STATUS_VALUES,
      fieldName: 'Status',
    }),

    // Optional fields
    preferredContactMethod: commonFieldsSchema.optionalOneOf({
      allowed: PREFERRED_CONTACT_VALUES,
      fieldName: 'Preferred Contact Method',
    }),
    language: commonFieldsSchema.optionalOneOf({
      allowed: LANGUAGE_VALUES,
      fieldName: 'Language',
    }),

    // On create the start date cannot be in the past; on edit an existing past
    // date has to remain valid, so the check is dropped entirely.
    startDate: isEdit
      ? z.unknown().nullish()
      : commonFieldsSchema.optionalFutureDate({fieldName: 'Start Date'}),
    title: commonFieldsSchema.text({fieldName: 'Title', limit: 100}).optional(),
    notes: commonFieldsSchema
      .text({fieldName: 'Notes', limit: 2000})
      .optional(),
    patientIds: z.array(z.string()),
  });
};
