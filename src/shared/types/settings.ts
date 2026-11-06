import {z} from 'zod';

import {
  hhaCredentialsSchema,
  passwordUpdateSchema,
  personalDetailsSchema,
} from '@/shared/schemas/settings';

export type PersonalDetailsUpdateFormPayload = z.infer<
  ReturnType<typeof personalDetailsSchema>
>;

export type PasswordUpdateFormPayload = z.infer<
  ReturnType<typeof passwordUpdateSchema>
>;

export type HhaCredentialsFormPayload = z.infer<
  ReturnType<typeof hhaCredentialsSchema>
>;

export interface OtpMethods {
  id: string;
  email: boolean;
  phone: boolean;
}

// The three choices the two-step verification card offers, each a fixed
// combination of the email/phone flags the API stores.
export type OtpMethodChoice = 'email' | 'phone' | 'both';

export interface UpdateOtpMethodsPayload {
  otpMethods: OtpMethods;
}

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface DayWorkingHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export type WorkingHours = Record<DayOfWeek, DayWorkingHours>;

export interface UpdateWorkingHoursPayload {
  workingHours: WorkingHours;
}

export type WorkingHoursStatus =
  | {kind: 'openNow'; closesAt: string}
  | {kind: 'closedOpensAt'; opensAt: string}
  | {kind: 'closedOpensOn'; day: DayOfWeek; opensAt: string}
  | {kind: 'closedAllWeek'};

export type TimeZoneKey =
  'EASTERN' | 'CENTRAL' | 'MOUNTAIN' | 'PACIFIC' | 'ALASKA' | 'HAWAII';

export type SettingsSection =
  'escalation' | 'organization' | 'security' | 'profile' | 'integrations';

// Flag colours that escalate, each carrying its own policy. GREEN never
// escalates, so it has none.
export type EscalationFlag = 'RED' | 'YELLOW';

export type EscalationStepType =
  'PRIMARY_NURSE' | 'SECONDARY_NURSE' | 'CASE_MANAGER' | 'ADMIN';

export type EscalationTtlUnit = 'MINUTES' | 'HOURS';

// "Push" in the UI is IN_APP.
export type EscalationChannel = 'IN_APP' | 'EMAIL' | 'SMS';

// A step as the API stores it. `ttlMinutes` is the deadline the engine reads;
// `ttlUnit` only remembers how the admin entered it. Both are null on the
// terminal ADMIN step, which never expires.
export interface EscalationPolicyStep {
  type: EscalationStepType;
  ttlMinutes: number | null;
  ttlUnit: EscalationTtlUnit | null;
  channels: EscalationChannel[];
}

export interface EscalationPolicy {
  flag: EscalationFlag;
  version: number;
  steps: EscalationPolicyStep[];
  updatedAt: string;
  updatedBy: string | null;
}

export interface OrganizationEscalationPolicies {
  escalationPolicies: EscalationPolicy[];
}

export interface UpdateEscalationPolicyPayload {
  version: number;
  steps: EscalationPolicyStep[];
}

// A step while it is being edited. The deadline is kept as the text in the
// field, in its unit, so the admin can clear it while typing.
export interface EscalationDraftStep {
  id: string;
  type: EscalationStepType;
  ttlValue: string;
  ttlUnit: EscalationTtlUnit;
  channels: EscalationChannel[];
}

// Unsaved edits to one flag's policy, pinned to the version they started from
// so saving over someone else's newer version is refused (409), not silent.
// `savedAt` marks a draft the server accepted; it stays on screen until the
// refetched policy arrives, so the old policy never flashes back in between.
export interface EscalationPolicyDraft {
  version: number;
  steps: EscalationDraftStep[];
  savedAt?: number;
}
