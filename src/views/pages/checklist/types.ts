import {
  ChecklistAnswer,
  ChecklistOption,
  ChecklistQuestion,
  ChecklistSection,
  SectionAttachment,
} from '@/shared/interfaces/checklist';
import {isQuestionSatisfied} from '@/shared/utils/assessmentChecklistUtils';

export type {
  ChecklistAnswer,
  ChecklistOption,
  ChecklistQuestion,
  ChecklistSection,
  SectionAttachment,
};

export interface ChecklistTemplateItem {
  id: string;
  title: string;
  description?: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  sortOrder: number;
  questions: TemplateQuestion[];
}

export interface TemplateQuestion {
  id: string;
  title: string;
  sectionLabel: string;
  type: string;
  required: boolean;
  options: (string | {title: string; flag?: string; points?: number})[] | null;
  placeholder: string | null;
  sortOrder: number;
}

// Normalize a single option into {title, flag, points} regardless of the shape
// the API sends. Options may arrive as:
//   - a plain string ("Yes")
//   - the raw rich object ({title, flag, points})
//   - the wrapped form ({label, value}) where label/value are themselves the
//     rich object — this is what GET /assessments/templates/:id returns today.
const extractOptionParts = ({
  option,
}: {
  option: unknown;
}): {title: string; flag?: string; points?: number} => {
  if (option == null) return {title: ''};
  if (typeof option === 'string') return {title: option};

  const opt = option as Record<string, any>;

  // Unwrap whichever side carries the rich object when the API wrapped it.
  let inner: any = opt;
  if (opt.value && typeof opt.value === 'object') inner = opt.value;
  else if (opt.label && typeof opt.label === 'object') inner = opt.label;

  const title = typeof inner === 'string' ? inner : (inner?.title ?? '');

  return {
    title,
    flag: inner?.flag ?? opt.flag,
    points: inner?.points ?? opt.points,
  };
};

export const mapChecklistOptions = ({
  options,
}: {
  options: unknown;
}): ChecklistOption[] =>
  (Array.isArray(options) ? options : []).map((option) => {
    const {title, flag, points} = extractOptionParts({option});

    return {label: title, value: title, flag, points};
  });

export interface RawChecklistQuestion {
  id: string;
  title: string;
  sectionLabel?: string;
  type: string;
  required?: boolean;
  options?: unknown;
  placeholder?: string | null;
}

export interface RawChecklistSection {
  id: string;
  title: string;
  questions?: RawChecklistQuestion[];
}

// Normalize the template payload returned by GET /assessments/templates/:id
// into the shape the checklist form renders. Each question's options are
// flattened to {label, value, flag, points}; the API wraps them as
// {label: {...}, value: {...}}, which cannot be rendered or matched directly.
export const mapChecklistSections = ({
  sections,
}: {
  sections?: RawChecklistSection[];
}): ChecklistSection[] =>
  (Array.isArray(sections) ? sections : []).map((section) => ({
    id: section.id,
    title: section.title,
    questions: (section.questions ?? []).map((question) => ({
      id: question.id,
      title: question.title,
      sectionLabel: question.sectionLabel || section.title,
      type: question.type,
      required: question.required ?? false,
      options: mapChecklistOptions({options: question.options}),
      placeholder: question.placeholder || '',
    })),
  }));

export const isSectionComplete = ({
  section,
  answers,
}: {
  section: ChecklistSection;
  answers: ChecklistAnswer[];
}): boolean =>
  section.questions.every((question) =>
    isQuestionSatisfied({
      question,
      value: answers.find((answer) => answer.questionId === question.id)
        ?.selectedOption,
    })
  );
