import {z} from 'zod';

import {
  caregiverRedFlagSchema,
  redFlagFormSchema,
} from '@/shared/schemas/redFlag';

// The reason select starts empty, so what the form holds is not what the schema
// produces. react-hook-form needs both, as its first and third generics.
export type RedFlagFormInput = z.input<ReturnType<typeof redFlagFormSchema>>;

export type RedFlagFormValues = z.output<ReturnType<typeof redFlagFormSchema>>;

// The caregiver form adds the patient and the "Other" text. Same input/output
// split as above: the reason select still starts empty.
export type CaregiverRedFlagInput = z.input<
  ReturnType<typeof caregiverRedFlagSchema>
>;

export type CaregiverRedFlagValues = z.output<
  ReturnType<typeof caregiverRedFlagSchema>
>;
