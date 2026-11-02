import {z} from 'zod';

import {
  ACTION_TAKEN_CHECKBOXES,
  ACTION_TAKEN_FOLLOW_UP_FIELDS,
  ACTION_TAKEN_SUPERVISORY_VISIT_FIELDS,
} from '@/shared/constants/flag';
import {followUpTaskSchema} from '@/shared/schemas/followUp';
import {supervisoryVisitScheduleSchema} from '@/shared/schemas/supervisoryVisit';
import {TranslateFunction} from '@/shared/types/common';

import {commonSchema} from './commonSchemaCreator';

// `zone` is the organization's; the follow-up due and visit window clock
// times are read in it.
export const actionTakenFormSchema = ({
  t,
  zone,
}: {
  t: TranslateFunction;
  zone?: string;
}) => {
  return (
    z
      .object({
        guidedCaregiverOnCall: z.boolean(),
        guidedPatientOnCall: z.boolean(),
        sentInstructionsToEmail: z.boolean(),
        teamDispatched: z.boolean(),

        notes: commonSchema(t).text({
          fieldName: 'Notes',
          limit: 5000,
          required: t('validation.fieldRequired', {fieldName: 'Notes'}),
        }),

        requireFollowUp: z.boolean(),
        followUpTitle: z.string().trim().optional(),
        followUpDate: z.unknown().nullish(),
        followUpTime: z.string().optional(),
        followUpDescription: z.string().trim().optional(),
        followUpAssigneeUserOrganizationId: z.string().trim().optional(),
        followUpPriority: z.string().trim().optional(),
        followUpChecklistTemplateId: z.string().trim().optional(),

        requireSupervisoryVisit: z.boolean(),
        supervisoryVisitDate: z.unknown().nullish(),
        supervisoryVisitStartTime: z.string().optional(),
        supervisoryVisitEndTime: z.string().optional(),
        supervisoryVisitAssigneeUserOrganizationId: z
          .string()
          .trim()
          .optional(),
        supervisoryVisitChecklistTemplateId: z.string().trim().optional(),
        visitInstructions: z.string().trim().optional(),
      })

      // Everything below was a Yup `.when()` or a `context.parent` test, both of
      // which read sibling fields. Zod cannot do that from inside a field, so the
      // whole conditional block moves onto the object and each issue is pathed
      // back to the field that should display it.
      .superRefine((values, ctx) => {
        const require = ({field, message}: {field: string; message: string}) =>
          ctx.addIssue({code: 'custom', path: [field], message});

        // Mirrors the backend's `actions` min(1) rule: at least one action
        // checkbox must be selected. The group-level error is surfaced on the
        // first action field so it renders once beneath the checkbox row.
        const hasAction = ACTION_TAKEN_CHECKBOXES.some(
          ({name}) => (values as Record<string, unknown>)[name]
        );

        if (!hasAction) {
          require({
            field: 'guidedCaregiverOnCall',
            message: t('flag.actionTaken.atLeastOneActionRequired'),
          });
        }

        // Runs the work item's own schema, reporting on this form's field names.
        const requireEmbedded = ({
          schema,
          fieldMap,
        }: {
          schema: z.ZodType;
          fieldMap: Record<string, keyof typeof values>;
        }) =>
          schema
            .safeParse(
              Object.fromEntries(
                Object.entries(fieldMap).map(([itemField, formField]) => [
                  itemField,
                  values[formField],
                ])
              )
            )
            .error?.issues.forEach((issue) =>
              require({
                field: fieldMap[String(issue.path[0])] ?? String(issue.path[0]),
                message: issue.message,
              })
            );

        if (values.requireFollowUp)
          requireEmbedded({
            schema: followUpTaskSchema({t, zone}),
            fieldMap: ACTION_TAKEN_FOLLOW_UP_FIELDS,
          });

        if (values.requireSupervisoryVisit) {
          requireEmbedded({
            schema: supervisoryVisitScheduleSchema({t, zone}),
            fieldMap: ACTION_TAKEN_SUPERVISORY_VISIT_FIELDS,
          });

          if (!values.visitInstructions?.trim()) {
            require({
              field: 'visitInstructions',
              message: t('validation.fieldRequired', {
                fieldName: 'Visit Instructions',
              }),
            });
          }
        }
      })
  );
};
