import {
  DayOfWeek,
  EscalationChannel,
  EscalationFlag,
  EscalationStepType,
  EscalationTtlUnit,
  OtpMethodChoice,
  OtpMethods,
  SettingsSection,
  TimeZoneKey,
} from '@/shared/types/settings';

export const DAYS_ORDER: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const AVAILABLE_TIME_ZONES: Record<
  string,
  {value: string; label: string; key: TimeZoneKey; cities: string}
> = {
  eastern: {
    value: 'America/New_York',
    label: 'Eastern Time (US & Canada)',
    key: 'EASTERN',
    cities: 'New York, Miami',
  },
  central: {
    value: 'America/Chicago',
    label: 'Central Time (US & Canada)',
    key: 'CENTRAL',
    cities: 'Chicago, Dallas, Houston',
  },
  mountain: {
    value: 'America/Denver',
    label: 'Mountain Time (US & Canada)',
    key: 'MOUNTAIN',
    cities: 'Denver, Salt Lake City',
  },
  pacific: {
    value: 'America/Los_Angeles',
    label: 'Pacific Time (US & Canada)',
    key: 'PACIFIC',
    cities: 'Los Angeles, Seattle',
  },
  alaska: {
    value: 'America/Anchorage',
    label: 'Alaska Time (US & Canada)',
    key: 'ALASKA',
    cities: 'Anchorage, Juneau',
  },
  hawaii: {
    value: 'Pacific/Honolulu',
    label: 'Hawaii Time (US & Canada)',
    key: 'HAWAII',
    cities: 'Honolulu',
  },
};

export const TIME_ZONE_OPTIONS = Object.values(AVAILABLE_TIME_ZONES);

export const OTP_METHOD_OPTIONS: {
  value: OtpMethodChoice;
  icon: string;
  flags: Pick<OtpMethods, 'email' | 'phone'>;
  requiresPhone: boolean;
  isRecommended: boolean;
}[] = [
  {
    value: 'email',
    icon: 'mdi:email-outline',
    flags: {email: true, phone: false},
    requiresPhone: false,
    isRecommended: false,
  },
  {
    value: 'phone',
    icon: 'mdi:message-text-outline',
    flags: {email: false, phone: true},
    requiresPhone: true,
    isRecommended: false,
  },
  {
    value: 'both',
    icon: 'mdi:shield-check-outline',
    flags: {email: true, phone: true},
    requiresPhone: true,
    isRecommended: true,
  },
];

export const SETTINGS_SECTION_URL_KEY = 'section';

export const SETTINGS_SECTION_KEYS = {
  escalation: 'escalation',
  organization: 'organization',
  security: 'security',
  profile: 'profile',
} as const satisfies Record<string, SettingsSection>;

// The settings page's side menu, in display order. Admin-only sections are
// dropped for every other role, both from the menu and from the URL parser.
export const SETTINGS_SECTIONS: {
  value: SettingsSection;
  labelKey: string;
  adminOnly: boolean;
}[] = [
  {
    value: SETTINGS_SECTION_KEYS.escalation,
    labelKey: 'sections.escalation',
    adminOnly: true,
  },
  {
    value: SETTINGS_SECTION_KEYS.organization,
    labelKey: 'sections.organization',
    adminOnly: true,
  },
  {
    value: SETTINGS_SECTION_KEYS.security,
    labelKey: 'sections.security',
    adminOnly: false,
  },
  {
    value: SETTINGS_SECTION_KEYS.profile,
    labelKey: 'sections.profile',
    adminOnly: false,
  },
];

export const ESCALATION_STEP_TYPES = {
  primaryNurse: 'PRIMARY_NURSE',
  secondaryNurse: 'SECONDARY_NURSE',
  caseManager: 'CASE_MANAGER',
  admin: 'ADMIN',
} as const satisfies Record<string, EscalationStepType>;

// Every step type in the default flow order. `fallbackKey` names the region
// nurse the backend pages automatically, on the same deadline and channels,
// when the patient has no nurse of that kind or they don't respond.
export const ESCALATION_STEP_OPTIONS: {
  value: EscalationStepType;
  labelKey: string;
  fallbackKey: string | null;
}[] = [
  {
    value: ESCALATION_STEP_TYPES.primaryNurse,
    labelKey: 'escalationSettings.stepTypes.PRIMARY_NURSE',
    fallbackKey: 'primaryNurse',
  },
  {
    value: ESCALATION_STEP_TYPES.secondaryNurse,
    labelKey: 'escalationSettings.stepTypes.SECONDARY_NURSE',
    fallbackKey: 'secondaryNurse',
  },
  {
    value: ESCALATION_STEP_TYPES.caseManager,
    labelKey: 'escalationSettings.stepTypes.CASE_MANAGER',
    fallbackKey: null,
  },
  {
    value: ESCALATION_STEP_TYPES.admin,
    labelKey: 'escalationSettings.stepTypes.ADMIN',
    fallbackKey: null,
  },
];

export const ESCALATION_FLAG_OPTIONS: {
  value: EscalationFlag;
  labelKey: string;
  dotColor: string;
}[] = [
  {
    value: 'RED',
    labelKey: 'escalationSettings.flags.RED',
    dotColor: 'customColors.severityCriticalBar',
  },
  {
    value: 'YELLOW',
    labelKey: 'escalationSettings.flags.YELLOW',
    dotColor: 'customColors.severityModerateBar',
  },
];

export const ESCALATION_TTL_UNITS: Record<EscalationTtlUnit, number> = {
  MINUTES: 1,
  HOURS: 60,
};

// Display order of the notify channels, also the order they are saved in.
export const ESCALATION_CHANNELS: EscalationChannel[] = [
  'IN_APP',
  'EMAIL',
  'SMS',
];

export const ESCALATION_NEW_STEP_MINUTES = 5;

export const ORGANIZATION_SETTINGS_LAYOUT = {
  dayRowHeight: 56,
  timeFieldWidth: 150,
} as const;
