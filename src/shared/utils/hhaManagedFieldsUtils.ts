import {HhaManagedFieldGroup} from '@/shared/interfaces/hhaSync';

/**
 * A record's managed payload keys: the fixed ones plus each group whose `when`
 * holds. Mirrors buildHhaManagedFields on the backend (derived fields such as
 * county are managed only while their ZIP resolves).
 */
export const buildHhaManagedFields = ({
  baseFields,
  conditionalFields = [],
}: {
  baseFields: readonly string[];
  conditionalFields?: HhaManagedFieldGroup[];
}): string[] =>
  conditionalFields.reduce(
    (fields: string[], group) =>
      group.when ? fields.concat(group.fields) : fields,
    Array.from(baseFields)
  );

/**
 * Strips HHAeXchange-managed keys out of an update payload.
 *
 * Why this is needed at all: the backend rejects a payload that CONTAINS a
 * managed field on an HHA-sourced record, not one that changes it. A disabled
 * MUI input is still a registered react-hook-form field and still submits its
 * value, so a form that merely greys those inputs out would send every managed
 * field on every save — and the whole update would 400, including the
 * PreventaTri-owned fields the user actually edited.
 *
 * Greying the inputs out and omitting the keys are therefore two halves of one
 * rule: the first tells the user, the second makes the request valid.
 *
 * Shared by patients and caregivers because the guard is identical on both.
 */
export const omitHhaManagedFields = <T extends Record<string, unknown>>({
  payload,
  isHhaManaged,
  managedFields,
}: {
  payload: T;
  isHhaManaged: boolean;
  managedFields: readonly string[];
}): Partial<T> => {
  if (!isHhaManaged) return payload;

  return Object.keys(payload).reduce((kept: Partial<T>, key) => {
    if (!managedFields.includes(key)) {
      kept[key as keyof T] = payload[key as keyof T];
    }

    return kept;
  }, {});
};
