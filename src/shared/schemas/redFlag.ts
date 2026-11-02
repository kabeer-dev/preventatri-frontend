import {z} from 'zod';

import {
  RED_FLAG_DESCRIPTION_LIMIT,
  RED_FLAG_OTHER_REASON,
  RED_FLAG_OTHER_REASON_LIMIT,
  RED_FLAG_REASONS,
} from '@/shared/constants/redFlag';
import {TranslateFunction} from '@/shared/types/common';
import {buildRedFlagDescription} from '@/shared/utils/redFlagUtils';

import {commonSchema} from './commonSchemaCreator';

export const redFlagFormSchema = ({t}: {t: TranslateFunction}) => {
  const validReasonValues = Object.keys(RED_FLAG_REASONS).map(Number);

  return z.object({
    // The select starts empty and hands back a string, so the field is declared
    // as string-or-number rather than coerced: `z.coerce` would widen the input
    // type to `unknown` and turn '' into a valid 0.
    reason: z
      .union([z.string(), z.number()])
      .refine(
        (value) => value !== '' && validReasonValues.includes(Number(value)),
        {error: t('validation.invalidOption', {fieldName: 'reason'})}
      )
      .transform((value) => Number(value)),
    description: commonSchema(t).text({
      fieldName: 'Description',
      limit: RED_FLAG_DESCRIPTION_LIMIT,
      required: t('validation.fieldRequired', {fieldName: 'description'}),
    }),
  });
};

/**
 * The caregiver's red flag form. Same reason list and description rule as the
 * page it replaces, plus the patient she picks and the short text behind
 * "Other". The text is required only when "Other" is the chosen reason.
 */
export const caregiverRedFlagSchema = ({t}: {t: TranslateFunction}) =>
  redFlagFormSchema({t})
    .extend({
      patientId: commonSchema(t).requiredString({fieldName: 'Patient'}),
      otherReason: commonSchema(t).text({
        fieldName: t('caregiverRedFlag.otherReason'),
        limit: RED_FLAG_OTHER_REASON_LIMIT,
      }),
    })
    .refine(
      ({reason, otherReason}) =>
        reason !== RED_FLAG_OTHER_REASON || Boolean(otherReason),
      {
        path: ['otherReason'],
        error: t('validation.fieldRequired', {
          fieldName: t('caregiverRedFlag.otherReason'),
        }),
      }
    )

    // The "Other" text travels inside the description, so the two together are
    // what the API measures. Checked here so she is told before she sends,
    // rather than losing the whole flag to a rejection.
    .superRefine(({reason, otherReason, description}, ctx) => {
      const sentDescription = buildRedFlagDescription({
        reason,
        otherReason,
        description,
      });

      if (sentDescription.length <= RED_FLAG_DESCRIPTION_LIMIT) return;

      ctx.addIssue({
        code: 'custom',
        path: ['description'],
        message: t('validation.redFlagDescriptionLong', {
          limit: RED_FLAG_DESCRIPTION_LIMIT,
        }),
      });
    });
