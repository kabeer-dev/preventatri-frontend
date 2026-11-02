import {z} from 'zod';

import {actionTakenFormSchema} from '@/shared/schemas/flag';

export type ActionTakenFormValues = z.infer<
  ReturnType<typeof actionTakenFormSchema>
>;

export type ActiveFlagFieldVariant = 'default' | 'key' | 'long';

export type TimerPillEmphasis = 'solid' | 'soft';
