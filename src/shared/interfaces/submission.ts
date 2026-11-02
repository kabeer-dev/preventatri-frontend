import {CHECKLIST_SUBMISSION_STATUS} from '@/shared/constants/assessmentChecklists';
import {ChecklistFieldType} from '@/shared/interfaces/assessmentChecklistDetails';
import {
  AutoFlagAnswerValue,
  FlagMediaFile,
  FlagPersonRef,
} from '@/shared/interfaces/flag';
import {ToolbarTableUIProps} from '@/shared/interfaces/tables';
import {FollowUpFormPayload} from '@/shared/types/followUp';
import {RowAction} from '@/shared/types/tables';

export type SubmissionStatus =
  (typeof CHECKLIST_SUBMISSION_STATUS)[keyof typeof CHECKLIST_SUBMISSION_STATUS]['value'];

export interface SubmissionPersonName {
  firstName?: string | null;
  lastName?: string | null;
}

export interface SubmissionAssignmentRef {
  id: string;
  type: string;
  assigner: SubmissionPersonName | null;
}

// The fields of a list row as the API returns them.
export interface SubmissionResponse {
  id: string;
  patientId: string;
  status: SubmissionStatus | null;
  dueDate: string | null;
  deadline: string | null;
  submittedAt: string | null;
  lateDays: number | null;
  skipReason: string | null;
  voidedAt: string | null;
  assignment: SubmissionAssignmentRef | null;
  checklistTemplate: {title: string} | null;
  patient: SubmissionPersonName | null;
  assignee: SubmissionPersonName | null;
  risk: {flag: string | null} | null;
}

// What the remediation helpers need, shared by list rows and the detail.
export interface SubmissionTiming {
  status: SubmissionStatus;
  dueDate: string | null;
  deadline: string | null;
  lateDays: number | null;
  skipReason: string | null;
}

export interface Submission extends SubmissionTiming {
  id: string;
  patientId: string;
  checklistName: string;
  patientName: string;
  caregiverName: string;
  scheduleType: string | null;
  assignedByName: string;
  riskFlag: string | null;
  submittedAt: string;
  voidedAt: string | null;
}

export interface SubmissionActionTarget {
  id: string;
  name: string;
  patientId: string;
  patient: SubmissionPersonName | null;
}

export interface SubmissionActionDialogsProps {
  target: SubmissionActionTarget | null;
  modals: {
    voidModal: {isModalOpen: boolean};
    skipModal: {isModalOpen: boolean};
    followUpModal: {isModalOpen: boolean};
  };
  handlers: {
    closeAll: () => void;
    confirmVoid: ({reason}: {reason: string}) => void;
    confirmSkip: ({reason}: {reason: string}) => void;
    submitFollowUp: (values: FollowUpFormPayload) => void;
  };
  pending: {
    isVoiding: boolean;
    isSkipping: boolean;
    isCreatingFollowUp: boolean;
  };
}

export interface SubmissionPermissions {
  canSkip: boolean;
  canVoid: boolean;
  canCreateFollowUp: boolean;
}

export interface SubmissionNextStepCardProps {
  submission: SubmissionTiming;
  permissions: SubmissionPermissions;
  onSkip: () => void;
  onVoid: () => void;
  onCreateFollowUp: () => void;
}

export interface SubmissionScheduleCardProps {
  submission: SubmissionDetail;
}

export interface SubmissionAnswerQuestion {
  id: string;
  title: string;
  type: ChecklistFieldType;
  required: boolean;
  section: {title: string} | null;
}

export interface SubmissionAnswer {
  id: string;
  questionId: string;
  value: AutoFlagAnswerValue;
  comment: string | null;
  images: FlagMediaFile[] | null;
  question: SubmissionAnswerQuestion | null;
}

export interface SubmissionRisk {
  flag: string | null;
  riskScore: number | null;
  riskCategory: string | null;
  status: string | null;
  calculatedAt: string | null;
}

export interface SubmissionDetail extends SubmissionTiming {
  id: string;
  patientId: string;
  submittedAt: string | null;
  assignment: SubmissionAssignmentRef | null;
  visitNotes: string | null;
  voidReason: string | null;
  voidedAt: string | null;
  checklistTemplate: {title: string} | null;
  patient: FlagPersonRef | null;
  assignee: FlagPersonRef | null;
  answers: SubmissionAnswer[];
  risk: SubmissionRisk | null;
}

export interface SubmissionDetailsUIProps {
  submission: SubmissionDetail;
}

export interface SubmissionsTableUIProps extends ToolbarTableUIProps {
  submissions: Submission[];
  onEditSubmission?: RowAction;
  onVoidSubmission?: RowAction;
  onSkipSubmission?: RowAction;
  hidePatientColumn?: boolean;
  hideCaregiverColumn?: boolean;
  alwaysShowCaregiverColumn?: boolean;
  hideActions?: boolean;
  noRowsLabel?: string;
  titleInCard?: boolean;
}

export interface UpcomingAssessment {
  id: string;
  checklistTemplateId: string;
  patientId: string;
  assignmentId: string | null;
  status: SubmissionStatus;
  dueDate: string | null;
  deadline: string | null;
  checklistTemplate: {
    title: string;
  } | null;
  assignment: {
    id: string;
    type: string;
  } | null;
}
