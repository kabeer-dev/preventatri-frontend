import type {
  AssessmentChecklistStatus,
  AssessmentTemplateUsage,
  ChecklistTemplateType,
} from '@/shared/interfaces/assessmentChecklist';

export const CHECKLIST_FIELD_TYPES = {
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  SELECT: 'select',
  MULTI_SELECT: 'multiSelect',
  DATE: 'date',
  CHECKBOX: 'checkbox',
} as const;

export type ChecklistFieldType =
  (typeof CHECKLIST_FIELD_TYPES)[keyof typeof CHECKLIST_FIELD_TYPES];

export type ChecklistOptionItem =
  string | {title: string; flag?: string; points?: number};

export interface AssessmentChecklistDetailQuestion {
  id: string;
  title: string;
  type: ChecklistFieldType;
  required: boolean;
  options: ChecklistOptionItem[];
  sortOrder: number;
}

export interface AssessmentChecklistDetailSection {
  id: string;
  title: string;
  sortOrder: number;
  questions: AssessmentChecklistDetailQuestion[];
}

export interface AssessmentChecklistDetails {
  id: string;
  title: string;
  description: string;
  status: AssessmentChecklistStatus;
  type: ChecklistTemplateType;
  sections: AssessmentChecklistDetailSection[];
}

export interface AssessmentChecklistDetailsProps {
  checklistId: string;
}

export interface AssessmentChecklistDetailsUIProps {
  checklist: AssessmentChecklistDetails;
  usage: AssessmentTemplateUsage | null;
}

export interface AssessmentChecklistDetailsHeaderProps {
  checklist: AssessmentChecklistDetails;
  isArchiving: boolean;
  onArchive: () => void;
  onCopy: () => void;
}

export interface AssessmentChecklistQuestionsCardProps {
  checklist: AssessmentChecklistDetails;
}

export interface AssessmentChecklistQuestionRowProps {
  question: AssessmentChecklistDetailQuestion;
  number: string;
  showFlags: boolean;
}

export interface AssessmentChecklistUsagePanelProps {
  usage: AssessmentTemplateUsage;
  type: ChecklistTemplateType;
}
