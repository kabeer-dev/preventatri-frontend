import {Control, FieldValues, Path} from 'react-hook-form';

import type {AttachmentItem} from '@/shared/components/common/AttachmentGallery';
import type {
  FOLLOW_UP_TASK_OUTCOME,
  FOLLOW_UP_TASK_PRIORITY,
  FOLLOW_UP_TASK_SOURCE,
  FOLLOW_UP_TASK_STATUS,
} from '@/shared/constants/followUps';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {
  RunnerAnswers,
  RunnerQuestion,
} from '@/shared/interfaces/caregiverChecklistRunner';
import {ServerSideTablePaginationProps} from '@/shared/interfaces/hooks';
import {ListToolbarProps} from '@/shared/interfaces/listToolbar';
import {FormModalProps} from '@/shared/interfaces/modals';
import {SupervisoryVisitSummary} from '@/shared/interfaces/supervisoryVisit';
import {
  ChipConfig,
  ConfigChipProps,
  SelectOption,
  WorkItemAlert,
  WorkItemAnswer,
  WorkItemAssignee,
  WorkItemCareTeamMember,
  WorkItemChecklistTemplate,
  WorkItemEvent,
  WorkItemLockedPatient,
  WorkItemMeta,
  WorkItemPatient,
  WorkItemPerson,
  WorkItemSource,
  WorkItemTemplateQuestion,
  WorkItemTemplateSection,
} from '@/shared/interfaces/workItem';
import {
  FollowUpCancelFormValues,
  FollowUpCompleteFormValues,
  FollowUpFormPayload,
} from '@/shared/types/followUp';

// The shapes a follow-up task shares with supervisory visits live in
// workItem.ts; these names are kept for the follow-up components.
export type FollowUpChipConfig = ChipConfig;

export type FollowUpPerson = WorkItemPerson;

export type FollowUpAssignee = WorkItemAssignee;

export type FollowUpCareTeamMember = WorkItemCareTeamMember;

export type FollowUpPatient = WorkItemPatient;

export type FollowUpAlert = WorkItemAlert;

export type FollowUpMeta = WorkItemMeta;

export type FollowUpEvent = WorkItemEvent;

export type FollowUpTemplateQuestion = WorkItemTemplateQuestion;

export type FollowUpTemplateSection = WorkItemTemplateSection;

export type FollowUpChecklistTemplate = WorkItemChecklistTemplate;

export type FollowUpAnswer = WorkItemAnswer;

export type FollowUpAssigneeOption = SelectOption;

type ConfigValue<T> = T[keyof T] extends {value: infer V} ? V : never;

export type FollowUpStatus = ConfigValue<typeof FOLLOW_UP_TASK_STATUS>;

export type FollowUpPriority = ConfigValue<typeof FOLLOW_UP_TASK_PRIORITY>;

export type FollowUpOutcome = ConfigValue<typeof FOLLOW_UP_TASK_OUTCOME>;

export type FollowUpSourceType = ConfigValue<typeof FOLLOW_UP_TASK_SOURCE>;

export type FollowUpSource = WorkItemSource<FollowUpSourceType>;

// The visit a task was created from; canOpen is false on list rows.
export interface FollowUpLinkedVisit extends SupervisoryVisitSummary {
  canOpen: boolean;
}

export interface FollowUpFlagMeta {
  value: number;
  code: string;
  label: string;
  color: string;
}

// A list row. Details (FollowUpDetail) add the template, steps and history.
export interface FollowUpTask {
  id: string;
  organizationId: string;
  patientId: string;
  patient?: FollowUpPatient;
  title: string;
  description: string | null;
  priority: FollowUpPriority;
  priorityMeta: FollowUpMeta | null;
  status: FollowUpStatus;
  statusMeta: FollowUpMeta | null;
  isOverdue: boolean;
  dueAt: string;
  dueDeltaMinutes: number | null;
  sentReminderOffsets: number[];
  assigneeUserOrganizationId: string;
  assignee: FollowUpAssignee | null;
  originalAssignee: FollowUpAssignee | null;
  source: FollowUpSource;
  supervisoryVisitId: string | null;
  supervisoryVisit: FollowUpLinkedVisit | null;
  checklistTemplateId: string | null;
  visitInstructions: string | null;
  flagType: number | null;
  flagMeta: FollowUpFlagMeta | null;
  completionOutcome: FollowUpOutcome | null;
  completionOutcomeMeta: FollowUpMeta | null;
  completionNotes: string | null;
  completionFiles: AttachmentItem[];
  completionSource: string | null;
  overdueAt: string | null;
  completedAt: string | null;
  completedBy: string | null;
  completedByUser?: FollowUpPerson;
  cancelReason: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancelledByUser?: FollowUpPerson;
  createdBy: string;
  createdByUser?: FollowUpPerson;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpDetail extends FollowUpTask {
  checklistTemplate?: FollowUpChecklistTemplate;
  answers?: FollowUpAnswer[];
  events: FollowUpEvent[];
  caseManagerReply: string | null;
  caseManagerReplyFiles: AttachmentItem[];
}

export interface FollowUpOverdueSummary {
  count: number;
  oldestDueAt: string | null;
}

// Request bodies.
export interface FollowUpTaskPayload {
  patientId: string;
  title: string;
  description?: string;
  visitInstructions?: string;
  assigneeUserOrganizationId: string;
  priority: string;
  dueAt: string;
  checklistTemplateId?: string | null;
  submissionFlagId?: string;
  supervisoryVisitId?: string;
}

// Edit body: only the fields that differ from the task are sent.
export interface FollowUpTaskUpdatePayload {
  title?: string;
  description?: string | null;
  visitInstructions?: string | null;
  assigneeUserOrganizationId?: string;
  priority?: string;
  dueAt?: string;
  checklistTemplateId?: string | null;
}

export interface FollowUpTaskPermissions {
  canEdit: boolean;
  canCancel: boolean;
  canComplete: boolean;

  // PREVENT-772: reopen removed for now; uncomment to restore.
  // canReopen: boolean;
}

export interface FollowUpTaskActions {
  onEdit: () => void;
  onCancel: () => void;
  onComplete: () => void;

  // PREVENT-772: reopen removed for now; uncomment to restore.
  // onReopen: () => void;
}

// Component props.
export interface FollowUpsTableProps {
  title?: string;
}

export interface FollowUpsTableUIProps {
  tasks: FollowUpTask[];
  isLoading?: boolean;
  paginationProps?: ServerSideTablePaginationProps;
  toolbar?: ListToolbarProps;
  onRowClick: ({task}: {task: FollowUpTask}) => void;
  onAddClick?: () => void;
  canCreate?: boolean;
  overdueSummary?: FollowUpOverdueSummary | null;
  onShowOverdue?: () => void;
  title?: string;
  noRowsLabel?: string;
}

export interface FollowUpOverdueBannerProps {
  summary: FollowUpOverdueSummary;
  onShowOverdue?: () => void;
}

export interface FollowUpPatientOptionSource {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
}

// A patient the drawer is opened for (a visit's patient): shown, not chosen.
export type FollowUpLockedPatient = WorkItemLockedPatient;

export interface FollowUpFormModalProps extends FormModalProps<FollowUpFormPayload> {
  task?: FollowUpDetail | null;
  linkedAlert?: FollowUpAlert | null;
  lockedPatient?: FollowUpLockedPatient | null;
  initialValues?: Partial<FollowUpFormPayload>;
  submitLabel?: string;
}

export interface FollowUpFormModalUIProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  control: Control<FollowUpFormPayload>;
  isDirty: boolean;
  isLoading?: boolean;
  isEditMode?: boolean;
  patientPicker: AsyncSelectSource;
  assigneeOptions: FollowUpAssigneeOption[];
  checklistSource: AsyncSelectSource;
  isPatientFieldDisabled?: boolean;
  isAssigneeFieldDisabled?: boolean;
  isAssigneesLoading?: boolean;
  linkedAlert?: FollowUpAlert | null;
  submitLabel?: string;
}

export interface FollowUpDueFieldsProps {
  control: Control<FollowUpFormPayload>;
  disabled?: boolean;
}

export interface RHFSegmentedFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: {value: string; label: string}[];
  disabled?: boolean;
}

export interface FollowUpDetailsProps {
  id: string;
}

export interface FollowUpDetailsUIProps {
  task: FollowUpDetail;
  permissions: FollowUpTaskPermissions;
  actions: FollowUpTaskActions;
}

export interface FollowUpDetailsHeaderProps {
  task: FollowUpDetail;
  permissions: FollowUpTaskPermissions;
  actions: FollowUpTaskActions;
}

export interface FollowUpTaskCardProps {
  task: FollowUpDetail;
}

export interface FollowUpSourceVisitCardProps {
  visit: FollowUpLinkedVisit;
}

export interface FollowUpChecklistCardProps {
  task: FollowUpDetail;
}

export interface FollowUpChecklistSectionProps {
  task: FollowUpDetail;
}

// The one-question-at-a-time checklist run the assignee completes a task with.
export interface FollowUpChecklistRunnerProps {
  task: FollowUpDetail;
  questions: RunnerQuestion[];
  seededAnswers: RunnerAnswers;
}

export interface FollowUpAnswersCardProps {
  answers: FollowUpAnswer[];
}

export interface FollowUpHistoryCardProps {
  events: FollowUpEvent[];
}

export interface FollowUpCompleteDrawerProps {
  task: FollowUpDetail;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: ({
    values,
    files,
  }: {
    values: FollowUpCompleteFormValues;
    files: File[];
  }) => void;
  isLoading?: boolean;
}

export interface FollowUpCancelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: ({values}: {values: FollowUpCancelFormValues}) => void;
  isLoading?: boolean;
}

export interface CaregiverTasksCardProps {
  tasks: FollowUpTask[];
  isLoading?: boolean;
}

export type FollowUpChipProps = ConfigChipProps;
