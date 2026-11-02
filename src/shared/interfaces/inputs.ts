import {ReactNode, RefObject} from 'react';

import {Control, FieldPath, FieldValues} from 'react-hook-form';

import type {AudioRecorderHandle} from '@/shared/components/common/inputs/AudioRecorder';
import type {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import type {DateTime} from '@/shared/utils/dateUtils';

export interface ErrorMessageProps {
  errorMsg?: string;
}

interface SortOption {
  value: string;
  label: string;
}

interface SortConfig {
  options: Record<string, SortOption>;
  directions: Record<string, SortOption>;
}

export interface SortSelectsProps {
  sortValue: any;
  sortConfig?: SortConfig;
  setSortField: (field: string) => void;
  setDirection: (direction: string) => void;
}

export interface OtpInputProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  hideLabel?: boolean;
}

export interface FieldLabelProps {
  htmlFor?: string;
  id?: string;
  children: ReactNode;
}

export interface FieldPlaceholderProps {
  children: ReactNode;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface PasswordRule {
  id: string;
  messageKey: string;
  isMet: ({value}: {value: string}) => boolean;
}

export interface PasswordPolicyChecklistProps {
  password: string;
}

export interface DateRange {
  from?: string;
  to?: string;
}

export interface DateRangePresetOption {
  value: string;
  labelKey: string;
}

export interface DateRangeControlProps {
  range: DateRange;
  onRangeChange: (args: {range: DateRange}) => void;
  presets?: DateRangePresetOption[];

  // Longest custom range, as days from start to end (a "Last N days" preset).
  maxRangeDays?: number;
}

export interface DateRangeFormValues {
  from: DateTime | string | null;
  to: DateTime | string | null;
}

// One subset a list can be narrowed to by the segmented pill group.
export interface SegmentedTabOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
  disabledReason?: string;
}

export interface SegmentedTabsProps {
  value: string;
  options: SegmentedTabOption[];
  onChange: (args: {value: string}) => void;
  ariaLabel: string;
  disabled?: boolean;
  fullWidth?: boolean;
  flat?: boolean;
  showIndicator?: boolean;
}

// The photos and voice note every red flag form attaches. The labels are
// optional: the nurse's page puts its own heading above the pair.
export interface RedFlagAttachmentFieldsProps {
  images: File[];
  onImagesChange: ({files}: {files: File[]}) => void;
  onAudioChange: ({audioBlob}: {audioBlob: Blob | null}) => void;
  audioRecorderRef: RefObject<AudioRecorderHandle | null>;
  isSubmitting: boolean;
  uploadText: string;
  browseText: string;
  photosLabel?: string;
  voiceNoteLabel?: string;
  gap?: number;
}

export interface RHFAsyncAutocompleteFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  source: AsyncSelectSource;
  multiple?: boolean;

  /** Values chosen in a sibling field, hidden here. */
  hiddenValues?: string[];
  placeholder?: string;
  disabled?: boolean;
  noOptionsText?: ReactNode;
  loadingText?: ReactNode;
  onSelectOption?: ({option}: {option: SelectOption | null}) => void;
}
