import {z} from 'zod';

import {TIME_INPUT_PATTERN} from '@/shared/constants/general';
import {
  SUPERVISORY_VISIT_MAX_CAREGIVERS,
  SUPERVISORY_VISIT_OUTCOME_VALUES,
  SUPERVISORY_VISIT_REASON_MAX_LENGTH,
  SUPERVISORY_VISIT_TEXT_MAX_LENGTH,
  SUPERVISORY_VISIT_TYPE,
  SUPERVISORY_VISIT_TYPE_OTHER_MAX_LENGTH,
  SUPERVISORY_VISIT_TYPE_VALUES,
} from '@/shared/constants/supervisoryVisits';
import {TranslateFunction} from '@/shared/types/common';
import {combineDateAndTime, isFutureInstant} from '@/shared/utils/dateUtils';

import {commonSchema} from './commonSchemaCreator';
import {completionSchema, reasonSchema} from './workItem';

// Visit fields shared by the schedule/edit drawer and the resolve-a-flag form.
export const supervisoryVisitFields = ({t}: {t: TranslateFunction}) => {
  const common = commonSchema(t);

  return {
    visitType: common.requiredOneOf({
      allowed: SUPERVISORY_VISIT_TYPE_VALUES,
      fieldName: 'Visit type',
    }),
    visitTypeOther: z
      .string()
      .trim()
      .max(
        SUPERVISORY_VISIT_TYPE_OTHER_MAX_LENGTH,
        t('validation.textLong', {
          fieldName: 'Visit type',
          limit: SUPERVISORY_VISIT_TYPE_OTHER_MAX_LENGTH,
        })
      )
      .optional(),
    description: common.text({
      fieldName: 'Reason for visit',
      limit: SUPERVISORY_VISIT_TEXT_MAX_LENGTH,
    }),
    scheduledDate: z.unknown().nullish(),
    startTime: z
      .string()
      .regex(TIME_INPUT_PATTERN, t('followUps.validation.timeInvalid')),
    endTime: z
      .string()
      .regex(TIME_INPUT_PATTERN, t('followUps.validation.timeInvalid')),
    caregiverUserOrganizationIds: z
      .array(z.string())
      .max(SUPERVISORY_VISIT_MAX_CAREGIVERS),
  };
};

// Date, start and end are separate fields but one window, so the checks sit
// on the object and point at the field that should show them.
export const refineVisitSchedule = ({
  values,
  ctx,
  t,
  zone,
}: {
  values: {
    visitType?: string;
    visitTypeOther?: string;
    scheduledDate?: unknown;
    startTime: string;
    endTime: string;
  };
  ctx: z.RefinementCtx;
  t: TranslateFunction;
  zone?: string;
}) => {
  if (
    values.visitType === SUPERVISORY_VISIT_TYPE.OTHER.value &&
    !values.visitTypeOther?.trim()
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['visitTypeOther'],
      message: t('supervisoryVisits.validation.visitTypeOtherRequired'),
    });
  }

  if (!values.scheduledDate) {
    ctx.addIssue({
      code: 'custom',
      path: ['scheduledDate'],
      message: t('validation.fieldRequired', {fieldName: 'Visit date'}),
    });

    return;
  }

  const startAt = combineDateAndTime({
    date: values.scheduledDate,
    time: values.startTime,
    zone,
  });

  const endAt = combineDateAndTime({
    date: values.scheduledDate,
    time: values.endTime,
    zone,
  });

  if (!isFutureInstant({value: startAt})) {
    ctx.addIssue({
      code: 'custom',
      path: ['scheduledDate'],
      message: t('supervisoryVisits.validation.startInFuture'),
    });
  }

  if (startAt && endAt && endAt <= startAt) {
    ctx.addIssue({
      code: 'custom',
      path: ['endTime'],
      message: t('supervisoryVisits.validation.endAfterStart'),
    });
  }
};

// The visit's checklist and window on their own, for forms that embed them
// under their own field names.
export const supervisoryVisitScheduleSchema = ({
  t,
  zone,
}: {
  t: TranslateFunction;
  zone?: string;
}) => {
  const {scheduledDate, startTime, endTime} = supervisoryVisitFields({t});

  return z
    .object({
      checklistTemplateId: commonSchema(t).requiredString({
        fieldName: 'Checklist',
      }),
      scheduledDate,
      startTime,
      endTime,
    })
    .superRefine((values, ctx) => refineVisitSchedule({values, ctx, t, zone}));
};

export const supervisoryVisitFormSchema = ({
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
          checklistTemplateId: common.requiredString({fieldName: 'Checklist'}),
        },
        supervisoryVisitFields({t})
      )
    )
    .superRefine((values, ctx) => refineVisitSchedule({values, ctx, t, zone}));
};

export const supervisoryVisitCompleteSchema = ({t}: {t: TranslateFunction}) =>
  completionSchema({
    t,
    outcomeValues: SUPERVISORY_VISIT_OUTCOME_VALUES,
    notesFieldName: 'Findings',
    notesLimit: SUPERVISORY_VISIT_TEXT_MAX_LENGTH,
  });

export const supervisoryVisitReasonSchema = ({t}: {t: TranslateFunction}) =>
  reasonSchema({
    t,
    fieldName: 'Reason',
    limit: SUPERVISORY_VISIT_REASON_MAX_LENGTH,
  });
