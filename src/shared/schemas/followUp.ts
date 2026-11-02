import {z} from 'zod';

import {
  FOLLOW_UP_CANCEL_REASON_MAX_LENGTH,
  FOLLOW_UP_TASK_OUTCOME_VALUES,
  FOLLOW_UP_TASK_PRIORITY_VALUES,
  FOLLOW_UP_TEXT_MAX_LENGTH,
  FOLLOW_UP_TITLE_MAX_LENGTH,
} from '@/shared/constants/followUps';
import {TIME_INPUT_PATTERN} from '@/shared/constants/general';
import {TranslateFunction} from '@/shared/types/common';
import {combineDateAndTime, isFutureInstant} from '@/shared/utils/dateUtils';

import {commonSchema} from './commonSchemaCreator';
import {completionSchema, reasonSchema} from './workItem';

// Task fields shared by the create/edit drawer and the resolve-a-flag form.
const followUpTaskFields = ({t}: {t: TranslateFunction}) => {
  const common = commonSchema(t);

  return {
    title: common.requiredString({fieldName: 'Task title'}).max(
      FOLLOW_UP_TITLE_MAX_LENGTH,
      t('validation.textLong', {
        fieldName: 'Task title',
        limit: FOLLOW_UP_TITLE_MAX_LENGTH,
      })
    ),
    description: common.text({
      fieldName: 'Task description',
      limit: FOLLOW_UP_TEXT_MAX_LENGTH,
    }),
    priority: common.requiredOneOf({
      allowed: FOLLOW_UP_TASK_PRIORITY_VALUES,
      fieldName: 'Priority',
    }),
    dueDate: z.unknown().nullish(),
    dueTime: z
      .string()
      .regex(TIME_INPUT_PATTERN, t('followUps.validation.timeInvalid')),
    checklistTemplateId: z.string().trim().optional(),
  };
};

// Date and time are separate fields but one instant (read in the
// organization's zone), so the check sits on the object and points at the
// date field.
const refineDueInstant = ({
  values,
  ctx,
  t,
  zone,
}: {
  values: {dueDate?: unknown; dueTime: string};
  ctx: z.RefinementCtx;
  t: TranslateFunction;
  zone?: string;
}) => {
  if (!values.dueDate) {
    ctx.addIssue({
      code: 'custom',
      path: ['dueDate'],
      message: t('validation.fieldRequired', {fieldName: 'Due date'}),
    });

    return;
  }

  const dueAt = combineDateAndTime({
    date: values.dueDate,
    time: values.dueTime,
    zone,
  });

  if (!isFutureInstant({value: dueAt})) {
    ctx.addIssue({
      code: 'custom',
      path: ['dueDate'],
      message: t('followUps.validation.dueInFuture'),
    });
  }
};

// The task on its own, for forms that embed it under their own field names.
export const followUpTaskSchema = ({
  t,
  zone,
}: {
  t: TranslateFunction;
  zone?: string;
}) =>
  z
    .object(followUpTaskFields({t}))
    .superRefine((values, ctx) => refineDueInstant({values, ctx, t, zone}));

export const followUpFormSchema = ({
  t,
  zone,
}: {
  t: TranslateFunction;
  zone?: string;
}) => {
  const common = commonSchema(t);

  return z
    .object(
      Object.assign(
        {
          patientId: common.requiredString({fieldName: 'Patient'}),
          assigneeUserOrganizationId: common.requiredString({
            fieldName: 'Assignee',
          }),
          visitNotes: common.text({
            fieldName: 'Visit notes',
            limit: FOLLOW_UP_TEXT_MAX_LENGTH,
          }),
        },
        followUpTaskFields({t})
      )
    )
    .superRefine((values, ctx) => refineDueInstant({values, ctx, t, zone}));
};

export const followUpCompleteSchema = ({t}: {t: TranslateFunction}) =>
  completionSchema({
    t,
    outcomeValues: FOLLOW_UP_TASK_OUTCOME_VALUES,
    notesFieldName: 'Completion notes',
    notesLimit: FOLLOW_UP_TEXT_MAX_LENGTH,
  });

export const followUpCancelSchema = ({t}: {t: TranslateFunction}) =>
  reasonSchema({
    t,
    fieldName: 'Reason',
    limit: FOLLOW_UP_CANCEL_REASON_MAX_LENGTH,
  });
