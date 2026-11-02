import {z} from 'zod';

import type {NURSE_DASHBOARD_ITEM_TYPES} from '@/shared/constants/nurseDashboard';
import {nurseFormSchema} from '@/shared/schemas/nurse';

export type NurseDashboardItemType =
  (typeof NURSE_DASHBOARD_ITEM_TYPES)[keyof typeof NURSE_DASHBOARD_ITEM_TYPES]['value'];

// Nurse stats interface
export interface NurseStats {
  totalNurses: number;
  averageAlertsPerNurse: number;
  availableNurses: number;
}

export type NurseFormPayload = z.input<ReturnType<typeof nurseFormSchema>>;

export type NurseFormValues = z.output<ReturnType<typeof nurseFormSchema>>;
