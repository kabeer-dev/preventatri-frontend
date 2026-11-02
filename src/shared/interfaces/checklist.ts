export interface ChecklistOption {
  label: string;
  value: string;
  flag?: string;
  points?: number;
}

export interface ChecklistQuestion {
  id: string;
  title: string;
  sectionLabel: string;
  options: ChecklistOption[];
  type: string;
  required: boolean;

  /** Hint the template author wrote. Missing on most questions. */
  placeholder?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  questions: ChecklistQuestion[];
}

export interface ChecklistAnswer {
  questionId: string;
  selectedOption: string;
  comment: string;
}

/** One entry of the `answers` JSON a checklist submission sends. */
export interface SubmissionAnswerInput {
  questionId: string;

  /** The form's string encoding of the answer; null when nothing was given. */
  value: string | null;
  comment: string | null;
}

/** One photo the submission sends, under `images_{questionId}`. */
export interface SubmissionAttachmentInput {
  questionId: string;
  file: File;
}

export interface ChecklistFieldInputProps {
  type: string;
  value: string;
  onChange: ({value}: {value: string}) => void;

  /** Hint the template author wrote; the field's own wording otherwise. */
  placeholder?: string;

  /**
   * 'small' is the compact field of the section form; 'medium' the caregiver
   * runner on a desktop; 'large' the same runner on a phone.
   */
  size?: 'small' | 'medium' | 'large';
}

export interface SelectableOptionProps {
  label: string;
  selected: boolean;
  variant: 'radio' | 'checkbox';
  onClick: () => void;

  /**
   * 'small' is the inline row of the section form; 'medium' and 'large' are
   * the caregiver runner's outlined, thumb sized rows on desktop and phone.
   */
  size?: 'small' | 'medium' | 'large';

  /** Only the label, centred and bold: the one big Yes or No button. */
  labelOnly?: boolean;
}

export interface SectionAttachment {
  file: File;
  preview: string;
  id: string;
}

/** The one-page checklist form's state, flattened into a submission body. */
export interface SectionChecklistFormDataInput {
  sections: ChecklistSection[];
  answers: ChecklistAnswer[];
  sectionComments: Record<string, string>;
  sectionAttachments: Record<string, SectionAttachment[]>;
  fields?: Record<string, string>;
  scoreOnlySelect?: boolean;
}

/** A stored answer that knows which template section its question sits in. */
export interface SectionedAnswer {
  question?: {section?: {title?: string} | null} | null;
}
