import {Control, FieldValues, Path} from 'react-hook-form';

import type {AttachmentItem} from '@/shared/components/common/AttachmentGallery';
import type {
  SUPERVISORY_VISIT_OUTCOME,
  SUPERVISORY_VISIT_SOURCE,
  SUPERVISORY_VISIT_STATUS,
  SUPERVISORY_VISIT_TYPE,
} from '@/shared/constants/supervisoryVisits';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {
  RunnerAnswers,
  RunnerQuestion,
} from '@/shared/interfaces/caregiverChecklistRunner';
import {FollowUpTaskPayload} from '@/shared/interfaces/followUp';
import {ServerSideTablePaginationProps} from '@/shared/interfaces/hooks';
import {ListToolbarProps} from '@/shared/interfaces/listToolbar';
import {FormModalProps} from '@/shared/interfaces/modals';
import {
  SelectOption,
  WorkItemAnswer,
  WorkItemAssignee,
  WorkItemCareTeamMember,
  WorkItemChecklistOptionsParams,
  WorkItemChecklistTemplate,
  WorkItemEvent,
  WorkItemMeta,
  WorkItemPatient,
  WorkItemPerson,
  WorkItemSource,
} from '@/shared/interfaces/workItem';
import {FollowUpFormPayload} from '@/shared/types/followUp';
import {
  SupervisoryVisitCompleteFormValues,
  SupervisoryVisitFormPayload,
} from '@/shared/types/supervisoryVisit';

type ConfigValue<T> = T[keyof T] extends {value: infer V} ? V : never;

export type SupervisoryVisitStatus = ConfigValue<
  typeof SUPERVISORY_VISIT_STATUS
>;

export type SupervisoryVisitType = ConfigValue<typeof SUPERVISORY_VISIT_TYPE>;

export type SupervisoryVisitOutcome = ConfigValue<
  typeof SUPERVISORY_VISIT_OUTCOME
>;

export type SupervisoryVisitSourceType = ConfigValue<
  typeof SUPERVISORY_VISIT_SOURCE
>;

// A follow-up task spawned from the visit, as the visit details list it.
export interface SupervisoryVisitLinkedTask {
  id: string;
  title: string;
  status: string;
  statusMeta: WorkItemMeta | null;
  priority: string;
  priorityMeta: WorkItemMeta | null;
  dueAt: string;
  assignee: WorkItemAssignee | null;
}

// A list row. Details (SupervisoryVisitDetail) add the template, answers,
// caregivers, follow-ups and history.
export interface SupervisoryVisit {
  id: string;
  organizationId: string;
  patientId: string;
  patient?: WorkItemPatient;
  visitType: SupervisoryVisitType;
  visitTypeMeta: WorkItemMeta | null;
  visitTypeOther: string | null;
  description: string | null;
  status: SupervisoryVisitStatus;
  statusMeta: WorkItemMeta | null;
  isOverdue: boolean;
  scheduledStartAt: string;
  scheduledEndAt: string;
  scheduleDeltaMinutes: number | null;
  sentReminderOffsets: number[];
  assigneeUserOrganizationId: string;
  assignee: WorkItemAssignee | null;
  originalAssignee: WorkItemAssignee | null;
  caregivers?: WorkItemAssignee[];
  caregiversCount?: number | null;
  source: WorkItemSource<SupervisoryVisitSourceType>;
  checklistTemplateId: string;
  completionOutcome: SupervisoryVisitOutcome | null;
  completionOutcomeMeta: WorkItemMeta | null;
  completionNotes: string | null;
  completionFiles: AttachmentItem[];
  completionSource: string | null;
  overdueAt: string | null;
  completedAt: string | null;
  completedBy: string | null;
  completedByUser?: WorkItemPerson;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewedByUser?: WorkItemPerson;
  reviewNote: string | null;
  cancelReason: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancelledByUser?: WorkItemPerson;
  createdBy: string;
  createdByUser?: WorkItemPerson;
  createdAt: string;
  updatedAt: string;
}

// What the type, status and schedule labels read; a follow-up embeds this.
export type SupervisoryVisitSummary = Pick<
  SupervisoryVisit,
  | 'id'
  | 'visitType'
  | 'visitTypeMeta'
  | 'visitTypeOther'
  | 'status'
  | 'statusMeta'
  | 'scheduledStartAt'
  | 'scheduledEndAt'
>;

export interface SupervisoryVisitDetail extends SupervisoryVisit {
  checklistTemplate?: WorkItemChecklistTemplate;
  answers?: WorkItemAnswer[];
  caregivers: WorkItemAssignee[];
  followUpTasks: SupervisoryVisitLinkedTask[];
  events: WorkItemEvent[];
}

// Request bodies.
export interface SupervisoryVisitPayload {
  patientId: string;
  visitType: string;
  visitTypeOther?: string | null;
  description?: string;
  assigneeUserOrganizationId: string;
  checklistTemplateId: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  caregiverUserOrganizationIds: string[];
  submissionFlagId?: string;
}

// Edit body: only the fields that differ from the visit are sent.
export interface SupervisoryVisitUpdatePayload {
  visitType?: string;
  visitTypeOther?: string | null;
  description?: string | null;
  assigneeUserOrganizationId?: string;
  checklistTemplateId?: string;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  caregiverUserOrganizationIds?: string[];
}

// A follow-up task queued in the filing drawer, created when the visit is filed.
export interface QueuedFollowUp {
  localId: string;
  payload: FollowUpTaskPayload;
  assigneeLabel: string;
}

export interface SupervisoryVisitPermissions {
  canEdit: boolean;
  canCancel: boolean;
  canFile: boolean;
  canReview: boolean;

  // PREVENT-772: reopen removed for now; uncomment to restore.
  // canReopen: boolean;
  canAddFollowUp: boolean;
}

export interface SupervisoryVisitActions {
  onEdit: () => void;
  onCancel: () => void;
  onFile: () => void;
  onApprove: () => void;
  onRequestCorrection: () => void;

  // PREVENT-772: reopen removed for now; uncomment to restore.
  // onReopen: () => void;
  onAddFollowUp: () => void;
}

// Component props.
export interface SupervisoryVisitsTableUIProps {
  visits: SupervisoryVisit[];
  isLoading?: boolean;
  paginationProps?: ServerSideTablePaginationProps;
  toolbar?: ListToolbarProps;
  onRowClick: ({visit}: {visit: SupervisoryVisit}) => void;
  onAddClick?: () => void;
  canCreate?: boolean;
  title?: string;
  noRowsLabel?: string;
}

export interface SupervisoryVisitFormModalProps extends FormModalProps<SupervisoryVisitFormPayload> {
  visit?: SupervisoryVisitDetail | null;
}

export interface SupervisoryVisitFormModalUIProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  control: Control<SupervisoryVisitFormPayload>;
  isDirty: boolean;
  isLoading?: boolean;
  isEditMode?: boolean;
  patientPicker: AsyncSelectSource;
  assigneeOptions: SelectOption[];
  caregiverOptions: SelectOption[];
  checklistSeedTemplate?: WorkItemChecklistOptionsParams['seedTemplate'];
  isPatientFieldDisabled?: boolean;
  isCareTeamDisabled?: boolean;
  isCareTeamLoading?: boolean;
  showVisitTypeOther?: boolean;
}

export interface SupervisoryVisitChecklistFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  enabled?: boolean;
  seedTemplate?: WorkItemChecklistOptionsParams['seedTemplate'];
  disabled?: boolean;
}

export interface SupervisoryVisitScheduleFieldsProps<T extends FieldValues> {
  control: Control<T>;
  names: {date: Path<T>; startTime: Path<T>; endTime: Path<T>};
  labels: {date: string; startTime: string; endTime: string};
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export interface SupervisoryVisitDetailsProps {
  id: string;
}

export interface SupervisoryVisitDetailsUIProps {
  visit: SupervisoryVisitDetail;
  permissions: SupervisoryVisitPermissions;
  actions: SupervisoryVisitActions;
}

export interface SupervisoryVisitCardProps {
  visit: SupervisoryVisitDetail;
}

// The detail page's modals, driven by useSupervisoryVisitActions.
export interface SupervisoryVisitDialogsProps {
  visit: SupervisoryVisitDetail;
  actions: ReturnType<
    typeof import('@/shared/hooks/useSupervisoryVisitActions').useSupervisoryVisitActions
  >;
  onFollowUpSubmit: (values: FollowUpFormPayload) => void;
  isCreatingFollowUp?: boolean;
}

export interface SupervisoryVisitFollowUpsCardProps {
  visit: SupervisoryVisitDetail;
}

export interface SupervisoryVisitHistoryCardProps {
  events: WorkItemEvent[];
}

// The one-question-at-a-time checklist run the assignee files a visit with.
export interface SupervisoryVisitChecklistRunnerProps {
  visit: SupervisoryVisitDetail;
  questions: RunnerQuestion[];
  seededAnswers: RunnerAnswers;
}

export interface SupervisoryVisitCompleteDrawerProps {
  visit: SupervisoryVisitDetail;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: ({
    values,
    files,
    queuedFollowUps,
  }: {
    values: SupervisoryVisitCompleteFormValues;
    files: File[];
    queuedFollowUps: QueuedFollowUp[];
  }) => void;
  isLoading?: boolean;
}

export interface QueuedFollowUpsSectionProps {
  visit: SupervisoryVisitDetail;
  queued: QueuedFollowUp[];
  onChange: ({queued}: {queued: QueuedFollowUp[]}) => void;
  disabled?: boolean;
}

export interface SupervisoryVisitAssigneesResponse {
  assignees: WorkItemCareTeamMember[];
}
