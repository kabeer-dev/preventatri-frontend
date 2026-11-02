import {z} from 'zod';

import {TranslateFunction} from '@/shared/types/common';

import {commonSchema} from './commonSchemaCreator';

// Completion drawer body shared by follow-up tasks and supervisory visits.
export const completionSchema = ({
  t,
  outcomeValues,
  notesFieldName,
  notesLimit,
}: {
  t: TranslateFunction;
  outcomeValues: string[];
  notesFieldName: string;
  notesLimit: number;
}) => {
  const common = commonSchema(t);

  return z.object({
    outcome: common.requiredOneOf({
      allowed: outcomeValues,
      fieldName: 'Outcome',
    }),
    completionNotes: common.text({
      fieldName: notesFieldName,
      limit: notesLimit,
      required: t('validation.fieldRequired', {fieldName: notesFieldName}),
    }),
  });
};

// A required free-text reason (cancel, request correction).
export const reasonSchema = ({
  t,
  fieldName,
  limit,
}: {
  t: TranslateFunction;
  fieldName: string;
  limit: number;
}) =>
  z.object({
    reason: commonSchema(t).text({
      fieldName,
      limit,
      required: t('validation.fieldRequired', {fieldName}),
    }),
  });
