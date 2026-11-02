import {z} from 'zod';

import {regionFormSchema} from '@/shared/schemas/region';

export type RegionFormPayload = z.infer<ReturnType<typeof regionFormSchema>>;
