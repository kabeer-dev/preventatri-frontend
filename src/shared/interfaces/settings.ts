import {ReactNode} from 'react';

import {Control} from 'react-hook-form';

import {
  SETTINGS_SECTIONS,
  TIME_ZONE_OPTIONS,
} from '@/shared/constants/settings';
import type {
  EscalationChannel,
  EscalationDraftStep,
  EscalationFlag,
  EscalationStepType,
  EscalationTtlUnit,
  PasswordUpdateFormPayload,
  PersonalDetailsUpdateFormPayload,
  SettingsSection,
  TimeZoneKey,
} from '@/shared/types/settings';

export interface PersonalDetailsFormUIProps {
  control: Control<PersonalDetailsUpdateFormPayload>;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isDirty: boolean;
  isPending: boolean;
}

export interface PasswordUpdateFormUIProps {
  control: Control<PasswordUpdateFormPayload>;
  onSubmit: (e: React.FormEvent) => void;
  isDirty: boolean;
  isPending: boolean;
}

export interface ProfileImageProps {
  initialImage?: string;
  onImageChange?: (imageBlob: Blob | null) => void;
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  platform: string;
  ipAddress: string;
  createdAt: string;
  isCurrent: boolean;
}

export interface TimeZoneOptionRowProps {
  option: (typeof TIME_ZONE_OPTIONS)[number];

  /** Epoch millis the live clock renders from. */
  now: number;
}

export interface TimeZoneSelectProps {
  value: TimeZoneKey | null;
  now: number;
  onChange: (value: TimeZoneKey) => void;
}

export interface SettingsNavProps {
  sections: typeof SETTINGS_SECTIONS;
  value: SettingsSection;
  onChange: (value: SettingsSection) => void;
}

export interface EscalationFlagTab {
  value: EscalationFlag;
  labelKey: string;
  dotColor: string;
  stepCount: number;
  isDirty: boolean;
}

export interface EscalationFlagTabsProps {
  value: EscalationFlag;
  tabs: EscalationFlagTab[];
  onChange: (value: EscalationFlag) => void;
}

export interface EscalationStepRowProps {
  step: EscalationDraftStep;
  index: number;

  /** The step a flag moves to when this one's deadline passes. */
  nextStep: EscalationDraftStep | null;

  /** Types this row may switch to: its own plus any not used elsewhere. */
  typeOptions: EscalationStepType[];
  isDragging: boolean;
  disabled: boolean;
  onTypeChange: (args: {id: string; type: EscalationStepType}) => void;
  onChannelsChange: (args: {id: string; channels: EscalationChannel[]}) => void;
  onTtlValueChange: (args: {id: string; value: string}) => void;
  onTtlUnitChange: (args: {id: string; unit: EscalationTtlUnit}) => void;
  onRemove: (args: {id: string}) => void;
  onMove: (args: {id: string; toIndex: number}) => void;
  onDragStart: (id: string) => void;

  /** A dragged step is over this row, above or below its middle. */
  onDragOver: (args: {index: number; isLowerHalf: boolean}) => void;
  onDragEnd: () => void;
}

export interface EscalationChannelsSelectProps {
  value: EscalationChannel[];
  disabled: boolean;
  onChange: (channels: EscalationChannel[]) => void;
}

export interface SettingsSectionHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export interface EscalationStepHandleProps {
  step: EscalationDraftStep;
  index: number;
  isAdmin: boolean;
  disabled: boolean;
  onHandleHeldChange: (isHeld: boolean) => void;
  onMove: (args: {id: string; toIndex: number}) => void;
}

export interface EscalationTypeSelectProps {
  step: EscalationDraftStep;
  typeOptions: EscalationStepType[];
  disabled: boolean;
  onTypeChange: (args: {id: string; type: EscalationStepType}) => void;
}

export interface EscalationDeadlineFieldProps {
  step: EscalationDraftStep;
  disabled: boolean;
  onTtlValueChange: (args: {id: string; value: string}) => void;
  onTtlUnitChange: (args: {id: string; unit: EscalationTtlUnit}) => void;
}

export interface EscalationFallbackRowProps {
  fallbackKey: string;
  channelsLabel: string;
  deadlineLabel: string;
}

export interface EscalationNoResponseProps {
  index: number;
  nextStep: EscalationDraftStep | null;
}
