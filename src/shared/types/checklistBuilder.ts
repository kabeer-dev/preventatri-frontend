import type {
  ChecklistOptionFlag,
  ChecklistTemplateType,
} from '@/shared/interfaces/assessmentChecklist';
import type {ChecklistFieldType} from '@/shared/interfaces/assessmentChecklistDetails';

export type ChecklistBuilderOptionForm = {
  title: string;

  // Empty string means no flag picked yet, which is what the select clears to.
  flag: ChecklistOptionFlag | '';
};

export type ChecklistBuilderQuestionForm = {
  title: string;
  type: ChecklistFieldType;
  required: boolean;
  options: ChecklistBuilderOptionForm[];
};

export type ChecklistBuilderSectionForm = {
  title: string;
  questions: ChecklistBuilderQuestionForm[];
};

export type ChecklistBuilderFormValues = {
  title: string;
  description: string;
  sections: ChecklistBuilderSectionForm[];
};

export type ChecklistTemplateOptionPayload = {
  title: string;
  flag?: ChecklistOptionFlag;
};

export type ChecklistTemplateContentPayload = {
  title: string;
  description: string | null;
  sections: {
    title: string;
    questions: {
      title: string;
      type: ChecklistFieldType;
      required: boolean;
      options: ChecklistTemplateOptionPayload[];
    }[];
  }[];
};

export type ChecklistTemplateCreatePayload = ChecklistTemplateContentPayload & {
  type: ChecklistTemplateType;
};

export type NewChecklistFormValues = {
  title: string;
  description: string;
  type: ChecklistTemplateType | '';
  sourceTemplateId: string;
};

export type ChecklistStructureStats = {
  sections: number;
  items: number;
  requiredItems: number;
  canRaiseRed: number;
  canRaiseYellow: number;
};
