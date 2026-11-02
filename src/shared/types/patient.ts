import {z} from 'zod';

import {PATIENT_DRAWER_STEPS} from '@/shared/constants/patients';
import {
  patientAssignmentsFormSchema,
  patientFormSchema,
} from '@/shared/schemas/patient';

export type PatientStatus =
  'active' | 'waiting' | 'hospitalized' | 'discharged' | 'hold' | 'archived';

/** One fact an identity line can carry. */
export type PatientIdentityPart = 'age' | 'gender' | 'diagnoses' | 'county';

export interface PatientStats {
  totalPatients: number;
  redFlags: number;
  yellowFlags: number;
  greenFlags: number;
}

export type PatientFormPayload = z.infer<ReturnType<typeof patientFormSchema>>;

export type PatientAssignmentsFormPayload = z.infer<
  ReturnType<typeof patientAssignmentsFormSchema>
>;

export type PatientAssignmentFormItem =
  PatientAssignmentsFormPayload['assignments'][number];

export type PatientDrawerStep =
  (typeof PATIENT_DRAWER_STEPS)[keyof typeof PATIENT_DRAWER_STEPS];
