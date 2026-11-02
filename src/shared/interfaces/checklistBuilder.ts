import type {Control} from 'react-hook-form';

import type {useChecklistBuilder} from '@/shared/hooks/checklistBuilder/useChecklistBuilder';
import type {
  AssessmentTemplateApi,
  ChecklistTemplateType,
} from '@/shared/interfaces/assessmentChecklist';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import type {
  ChecklistBuilderFormValues,
  ChecklistStructureStats,
  NewChecklistFormValues,
} from '@/shared/types/checklistBuilder';

export type ChecklistBuilderConfirmAction = 'publish' | 'delete';

export type ChecklistBuilderControl = Control<ChecklistBuilderFormValues>;

export interface UseChecklistBuilderParams {
  template: AssessmentTemplateApi;
}

export interface ChecklistBuilderProps {
  checklistId: string;
}

export interface ChecklistBuilderFormProps {
  template: AssessmentTemplateApi;
}

export interface ChecklistBuilderDetailsProps {
  control: ChecklistBuilderControl;
}

export interface ChecklistBuilderUIProps {
  template: AssessmentTemplateApi;
  builder: ReturnType<typeof useChecklistBuilder>;
}

export interface ChecklistBuilderHeaderProps {
  template: AssessmentTemplateApi;
  title: string;
  isDirty: boolean;
  hasIssues: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  isDeleting: boolean;
  onSave: () => void;
  onPublish: () => void;
  onDelete: () => void;
}

export interface ChecklistBuilderConfirmationsProps {
  confirmAction: ChecklistBuilderConfirmAction | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface BuilderMoveParams {
  from: number;
  to: number;
}

export interface BuilderRowActionsProps {
  index: number;
  count: number;
  onMove: (params: BuilderMoveParams) => void;
  onRemove: () => void;
}

export interface BuilderListProps {
  control: ChecklistBuilderControl;
  templateType: ChecklistTemplateType;
}

export interface BuilderSectionCardProps extends BuilderListProps {
  sectionIndex: number;
  sectionCount: number;
  onMove: (params: BuilderMoveParams) => void;
  onRemove: () => void;
}

export interface BuilderQuestionListProps extends BuilderListProps {
  sectionIndex: number;
}

export interface BuilderQuestionProps extends BuilderQuestionListProps {
  questionIndex: number;
}

export interface BuilderQuestionRowProps extends BuilderQuestionProps {
  questionCount: number;
  onOpen: () => void;
  onMove: (params: BuilderMoveParams) => void;
  onRemove: () => void;
}

export interface BuilderQuestionEditorProps extends BuilderQuestionProps {
  onDone: () => void;
  onRemove: () => void;
}

export interface BuilderOptionRowProps extends BuilderQuestionProps {
  optionIndex: number;
  optionCount: number;
  onMove: (params: BuilderMoveParams) => void;
  onRemove: () => void;
}

export interface NewChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: Partial<
    Pick<NewChecklistFormValues, 'type' | 'sourceTemplateId'>
  >;
}

export interface NewChecklistModalUIProps {
  isOpen: boolean;
  isDirty: boolean;
  isLoading: boolean;
  control: Control<NewChecklistFormValues>;
  sourceTemplates: AsyncSelectSource;
  isSourceDisabled: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onTypeChange: () => void;
}

export interface ChecklistTypeSelectorProps {
  control: Control<NewChecklistFormValues>;
  disabled: boolean;
  onTypeChange: () => void;
}

export interface PublishIssuesPanelProps {
  issues: string[];
}

export interface StructurePanelProps {
  stats: ChecklistStructureStats;
  templateType: ChecklistTemplateType;
}
