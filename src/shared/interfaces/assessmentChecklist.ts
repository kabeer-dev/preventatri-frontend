import type {
  ASSESSMENT_CHECKLIST_STATUS,
  CHECKLIST_OPTION_FLAGS,
  CHECKLIST_TEMPLATE_TYPES,
} from '@/shared/constants/assessmentChecklists';
import type {ChecklistFieldType} from '@/shared/interfaces/assessmentChecklistDetails';
import {ToolbarTableUIProps} from '@/shared/interfaces/tables';

export type AssessmentChecklistStatus =
  (typeof ASSESSMENT_CHECKLIST_STATUS)[keyof typeof ASSESSMENT_CHECKLIST_STATUS]['value'];

export type ChecklistTemplateType =
  (typeof CHECKLIST_TEMPLATE_TYPES)[keyof typeof CHECKLIST_TEMPLATE_TYPES]['value'];

export type ChecklistOptionFlag = (typeof CHECKLIST_OPTION_FLAGS)[number];

export interface AssessmentTemplateOptionApi {
  title: string;
  flag?: ChecklistOptionFlag | null;
  points?: number;
}

export interface AssessmentTemplateQuestionApi {
  id: string;
  title: string;
  sectionLabel?: string;
  type: ChecklistFieldType;
  required: boolean;
  options: AssessmentTemplateOptionApi[] | null;
  placeholder: string | null;
  sortOrder: number;
}

export interface AssessmentTemplateSectionApi {
  id: string;
  title: string;
  sortOrder: number;
  questions: AssessmentTemplateQuestionApi[];
}

export interface AssessmentTemplateApi {
  id: string;
  organizationId: string;
  title: string;
  description: string | null;
  sections: AssessmentTemplateSectionApi[];
  status: AssessmentChecklistStatus;
  type: ChecklistTemplateType;
  createdAt: string;
  updatedAt: string;
}

// completed is null for patient checklists, redFlags for the other types.
export interface AssessmentTemplateUsage {
  assignees: number;
  patients: number;
  total: number;
  completed: number | null;
  redFlags: number | null;
  lastActivityAt: string | null;
}

// A type alias so it satisfies the Record params that buildDynamicURL expects.
export type AssessmentTemplateQueryParams = {
  includeUsage?: boolean;
  isSubRoute?: boolean;
};

export interface AssessmentTemplateResponse {
  template: AssessmentTemplateApi;
  usage: AssessmentTemplateUsage | null;
}

export interface AssessmentChecklist {
  id: string;
  name: string;
  description: string;
  sectionCount: number;
  questionCount: number;
  status: AssessmentChecklistStatus;
  type: ChecklistTemplateType;
  createdAt: string;
}

export interface ScoredAnswerValue {
  flag: string;
  title: number;
  points: number;
}

export interface AssessmentChecklistsTableUIProps extends ToolbarTableUIProps {
  checklists: AssessmentChecklist[];
  onAddClick: () => void;
}
