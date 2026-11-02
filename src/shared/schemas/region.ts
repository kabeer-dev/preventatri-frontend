import {z} from 'zod';

import {TranslateFunction} from '@/shared/types/common';

import {commonSchema} from './commonSchemaCreator';

export const regionFormSchema = ({t}: {t: TranslateFunction}) => {
  return (
    z
      .object({
        name: commonSchema(t).requiredString({fieldName: 'Region Name'}),
        isActive: z.boolean(),
        counties: z
          .array(
            z
              .string()
              .trim()
              .min(1, t('validation.fieldRequired', {fieldName: 'Counties'}))
          )
          .min(1, t('validation.fieldRequired', {fieldName: 'Counties'})),

        // Optional primary/secondary nurses (multiple allowed). A nurse cannot
        // be both a primary and a secondary nurse for the same region.
        primaryNurseProfileIds: z.array(z.string()),
        secondaryNurseProfileIds: z.array(z.string()),
      })

      // The old test reached the sibling field through Yup's `context.parent`.
      // Zod has no such escape hatch inside a field, so the comparison moves
      // onto the object and reports against the secondary list, as before.
      .superRefine((values, ctx) => {
        const {primaryNurseProfileIds, secondaryNurseProfileIds} = values;

        if (!secondaryNurseProfileIds?.length) return;

        const primarySet = new Set(primaryNurseProfileIds ?? []);

        if (secondaryNurseProfileIds.some((id) => primarySet.has(id))) {
          ctx.addIssue({
            code: 'custom',
            path: ['secondaryNurseProfileIds'],
            message: t('validation.regionNurseRolesMustDiffer'),
          });
        }
      })
  );
};
