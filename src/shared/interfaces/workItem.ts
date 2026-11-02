import {ReactNode} from 'react';

import type {ThemeColor} from '@/@core/theme/types';
import {ChecklistFieldType} from '@/shared/interfaces/assessmentChecklistDetails';
import {TranslateFunction} from '@/shared/types/common';

// Shapes shared by follow-up tasks and supervisory visits: both are patient
// work items with a care-team assignee, a checklist and a history log.

export interface ChipConfig {
  value: string;
  labelKey: string;
  color: ThemeColor;
}

export interface WorkItemPerson {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

export interface WorkItemAssignee {
  userOrgId: string;
  role: string;
  user: WorkItemPerson | null;
}

export interface WorkItemCareTeamMember {
  userOrgId: string;
  userId: string;
  role: string;
  careTeamRole: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface WorkItemPatient {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNo?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  county?: {
    id: string;
    name: string;
    region?: {id: string; name: string} | null;
  } | null;
}

export interface WorkItemAlert {
  id: string;
  flag: string;
  category: string;
  reason: number;
  description: string;
  status: string;
  createdAt: string;
}

export interface WorkItemSource<TType extends string = string> {
  type: TType;
  alert: WorkItemAlert | null;
}

export interface WorkItemMeta {
  value: string;
  label: string;
}

export interface WorkItemEvent {
  id: string;
  type: string;
  typeMeta: WorkItemMeta | null;
  actorType: string;
  actor: WorkItemPerson | null;
  fromStatus: string | null;
  toStatus: string | null;
  fromAssignee: WorkItemAssignee | null;
  toAssignee: WorkItemAssignee | null;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface WorkItemTemplateQuestion {
  id: string;
  title: string;
  type: ChecklistFieldType;
  required?: boolean;
  sectionLabel?: string;
  options?: {label: string; value: string}[];
  sortOrder?: number;
}

export interface WorkItemTemplateSection {
  id: string;
  title: string;
  questions: WorkItemTemplateQuestion[];
}

export interface WorkItemChecklistTemplate {
  id: string;
  title: string;
  sections: WorkItemTemplateSection[];
}

export interface WorkItemAnswer {
  questionId: string;
  value: unknown;
  comment: string | null;
  files: {url?: string; name?: string}[];
  question: {
    title: string;
    type: ChecklistFieldType;
    section: {title: string};
  } | null;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface WorkItemTemplateOptionSource {
  id: string;
  title: string;
}

export interface WorkItemChecklistOptionsParams {
  type: string;
  status?: string | null;
  enabled?: boolean;

  /** The saved template, so its label shows before its page loads. */
  seedTemplate?: {id?: string; title?: string} | null;
}

export interface WorkItemFactProps {
  label: string;
  value: ReactNode;
}

export interface WorkItemSectionTitleProps {
  children: string;
}

// The patient a work-item form is fixed to (edit mode, or spawned from a visit).
export interface WorkItemLockedPatient {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface PatientPickerOptionsParams {
  enabled: boolean;
  lockedPatient?: WorkItemLockedPatient | null;
}

// Component props shared by both features.
export interface ConfigChipProps {
  config?: ChipConfig | null;
  fallbackLabel?: string;
}

export interface ReasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: ({reason}: {reason: string}) => void;
  isLoading?: boolean;
  title: string;
  message: string;
  reasonLabel: string;
  reasonPlaceholder?: string;
  confirmLabel: string;
  dismissLabel: string;
  maxLength: number;
  confirmColor?: 'primary' | 'error';

  // Approve notes are optional; cancellations and corrections need a reason.
  isReasonRequired?: boolean;
}

export interface CompletionFormValues {
  outcome: string;
  completionNotes: string;
}

export interface CompletionDrawerLabels {
  title: string;
  subtitle: string;
  outcome: string;
  notes: string;
  notesHint: string;
  notesPlaceholder: string;
  evidence: string;
  evidenceOptional: string;
  permanent: string;
  confirm: string;
}

export interface CompletionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: ({
    values,
    files,
  }: {
    values: CompletionFormValues;
    files: File[];
  }) => void;
  isLoading?: boolean;
  formId: string;
  labels: CompletionDrawerLabels;
  outcomeOptions: SelectOption[];
  outcomeValues: string[];
  defaultOutcome: string;

  // Prefilled notes, e.g. the findings kept on a visit sent back for correction.
  defaultNotes?: string | null;
  notesFieldName: string;
  warning?: string | null;
  accept: string;
  maxFiles: number;

  // Extra sections rendered under the evidence dropzone.
  children?: ReactNode;
}

export interface ChecklistSummaryCardProps {
  title: string;
  questions: {id: string; title: string}[];
  hint?: string;
  emptyLabel: string;
}

export interface WorkItemPatientContactsProps {
  patient?: WorkItemPatient;
}

export interface WorkItemPatientCardProps {
  patientId: string;
  patient?: WorkItemPatient;
  alert?: WorkItemAlert | null;
  title: string;
  openPatientLabel: string;
  alertLabelKey?: string;
}

export interface MapEventToTimelineEntryParams {
  event: WorkItemEvent;
  eventTypes: Record<string, ChipConfig>;
  describe: ({
    event,
    t,
  }: {
    event: WorkItemEvent;
    t: TranslateFunction;
  }) => string;
  t: TranslateFunction;

  // Organization zone for the timestamps; browser zone when omitted.
  zone?: string;
}
