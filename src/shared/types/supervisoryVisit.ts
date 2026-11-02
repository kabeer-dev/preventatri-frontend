import {z} from 'zod';

import {
  supervisoryVisitCompleteSchema,
  supervisoryVisitFormSchema,
  supervisoryVisitReasonSchema,
} from '@/shared/schemas/supervisoryVisit';

export type SupervisoryVisitFormPayload = z.infer<
  ReturnType<typeof supervisoryVisitFormSchema>
>;

export type SupervisoryVisitCompleteFormValues = z.infer<
  ReturnType<typeof supervisoryVisitCompleteSchema>
>;

export type SupervisoryVisitReasonFormValues = z.infer<
  ReturnType<typeof supervisoryVisitReasonSchema>
>;
