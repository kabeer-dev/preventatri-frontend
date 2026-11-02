import {z} from 'zod';

import {ThemeColor} from '@/@core/theme/types';
import {caseManagerFormSchema} from '@/shared/schemas/caseManager';

export type CaseManagerStatus = 'active' | 'inactive';

export type CaseManagerStatusColorMap = Record<CaseManagerStatus, ThemeColor>;

export interface CaseManagerStats {
  totalCaseManagers: number;
  casesPerCaseManager: number;
  activeCaseManagers: number;
}

export type CaseManagerFormPayload = z.input<
  ReturnType<typeof caseManagerFormSchema>
>;

export type CaseManagerFormValues = z.output<
  ReturnType<typeof caseManagerFormSchema>
>;
