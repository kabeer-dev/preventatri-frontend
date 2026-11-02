import {z} from 'zod';

import {
  CHECKLIST_OPTION_FLAGS,
  CHECKLIST_TEMPLATE_TYPE_VALUES,
} from '@/shared/constants/assessmentChecklists';
import {
  CHECKLIST_BUILDER_EMPTY_TEXT,
  CHECKLIST_BUILDER_LIMITS,
} from '@/shared/constants/checklistBuilder';
import {CHECKLIST_FIELD_TYPES} from '@/shared/interfaces/assessmentChecklistDetails';
import {TranslateFunction} from '@/shared/types/common';
import {hasDuplicateTitles} from '@/shared/utils/checklistBuilderUtils';

import {commonSchema} from './commonSchemaCreator';

// Item and answer text may be blank on a draft; publish issues report it.
const limitedTitle = ({
  t,
  fieldName,
  limit,
  isRequired = true,
}: {
  t: TranslateFunction;
  fieldName: string;
  limit: number;
  isRequired?: boolean;
}) =>
  (isRequired ? commonSchema(t).requiredString({fieldName}) : z.string()).max(
    limit,
    t('validation.textLong', {fieldName, limit})
  );

export const newChecklistFormSchema = ({t}: {t: TranslateFunction}) =>
  z.object({
    title: commonSchema(t).requiredString({
      fieldName: t('assessmentChecklists.builder.fields.name'),
    }),
    description: z.string(),
    type: z.enum(CHECKLIST_TEMPLATE_TYPE_VALUES, {
      error: t('validation.fieldRequired', {
        fieldName: t('assessmentChecklists.create.type'),
      }),
    }),
    sourceTemplateId: z.string(),
  });

// Save-time rules only. A draft may still be incomplete; publishing is checked
// separately by getChecklistPublishIssues, mirroring the backend.
export const checklistDraftSchema = ({t}: {t: TranslateFunction}) =>
  z
    .object({
      title: commonSchema(t).requiredString({
        fieldName: t('assessmentChecklists.builder.fields.name'),
      }),
      description: z.string(),
      sections: z.array(
        z.object({
          title: limitedTitle({
            t,
            fieldName: t('assessmentChecklists.builder.fields.sectionTitle'),
            limit: CHECKLIST_BUILDER_LIMITS.sectionTitle,
          }),
          questions: z.array(
            z.object({
              title: limitedTitle({
                t,
                fieldName: t('assessmentChecklists.builder.fields.question'),
                limit: CHECKLIST_BUILDER_LIMITS.questionTitle,
                isRequired: false,
              }),
              type: z.enum(CHECKLIST_FIELD_TYPES),
              required: z.boolean(),
              options: z.array(
                z.object({
                  title: limitedTitle({
                    t,
                    fieldName: t('assessmentChecklists.builder.fields.answer'),
                    limit: CHECKLIST_BUILDER_LIMITS.optionTitle,
                    isRequired: false,
                  }),
                  flag: z.union([
                    z.enum(CHECKLIST_OPTION_FLAGS),
                    z.literal(CHECKLIST_BUILDER_EMPTY_TEXT),
                  ]),
                })
              ),
            })
          ),
        })
      ),
    })

    // The database rejects two sections with the same title, even on a draft.
    .superRefine((values, ctx) => {
      if (!hasDuplicateTitles({items: values.sections})) return;

      ctx.addIssue({
        code: 'custom',
        path: ['sections'],
        message: t('assessmentChecklists.builder.issues.duplicateSections'),
      });
    });
