import {CHECKLIST_FIELD_TYPES} from '@/shared/interfaces/assessmentChecklistDetails';

export const CHECKLIST_BUILDER_ICONS = {
  add: 'mdi:plus',
  delete: 'mdi:trash-can-outline',
  moveUp: 'mdi:arrow-up',
  moveDown: 'mdi:arrow-down',
  expand: 'mdi:chevron-down',
  collapse: 'mdi:chevron-up',
  warning: 'mdi:alert-outline',
} as const;

// Mirrors the backend column sizes so a draft never fails to save on length.
export const CHECKLIST_BUILDER_LIMITS = {
  sectionTitle: 100,
  questionTitle: 250,
  optionTitle: 250,
} as const;

export const CHECKLIST_BUILDER_DEFAULT_QUESTION_TYPE =
  CHECKLIST_FIELD_TYPES.SELECT;

export const CHECKLIST_SECTION_NUMBER_LENGTH = 2;

export const CHECKLIST_BUILDER_EMPTY_TEXT = '';

export const NEW_CHECKLIST_FORM_ID = 'new-checklist-form';

export const CHECKLIST_TYPE_LABEL_ID = 'new-checklist-type-label';
