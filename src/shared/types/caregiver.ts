import {z} from 'zod';

import {ThemeColor} from '@/@core/theme/types';
import {caregiverFormSchema} from '@/shared/schemas/caregiver';

export type CaregiverStatus = 'active' | 'inactive';

export type CaregiverStatusColorMap = Record<CaregiverStatus, ThemeColor>;

export interface CaregiverStats {
  totalCaregivers: number;
  inactiveCaregivers: number;
  activeCaregivers: number;
}

export type CaregiverFormPayload = z.input<
  ReturnType<typeof caregiverFormSchema>
>;

export type CaregiverFormValues = z.output<
  ReturnType<typeof caregiverFormSchema>
>;
