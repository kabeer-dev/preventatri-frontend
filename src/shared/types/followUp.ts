import {z} from 'zod';

import {
  followUpCancelSchema,
  followUpCompleteSchema,
  followUpFormSchema,
} from '@/shared/schemas/followUp';

export type FollowUpFormPayload = z.infer<
  ReturnType<typeof followUpFormSchema>
>;

export type FollowUpCompleteFormValues = z.infer<
  ReturnType<typeof followUpCompleteSchema>
>;

export type FollowUpCancelFormValues = z.infer<
  ReturnType<typeof followUpCancelSchema>
>;
