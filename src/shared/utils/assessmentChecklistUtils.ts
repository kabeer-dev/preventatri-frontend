import {
  ASSESSMENT_CHECKLIST_DEFAULTS,
  ASSESSMENT_CHECKLIST_STATUS,
  CHECKLIST_TEMPLATE_TYPES,
} from '@/shared/constants/assessmentChecklists';
import {PAIN_LEVEL_SCORE, RISK_FLAGS} from '@/shared/constants/submissions';
import {
  AssessmentChecklist,
  AssessmentChecklistStatus,
  AssessmentTemplateApi,
  ChecklistTemplateType,
  ScoredAnswerValue,
} from '@/shared/interfaces/assessmentChecklist';
import {
  AssessmentChecklistDetails,
  CHECKLIST_FIELD_TYPES,
  ChecklistFieldType,
  ChecklistOptionItem,
} from '@/shared/interfaces/assessmentChecklistDetails';
import {
  ChecklistOption,
  ChecklistQuestion,
  SectionChecklistFormDataInput,
  SectionedAnswer,
  SubmissionAnswerInput,
  SubmissionAttachmentInput,
} from '@/shared/interfaces/checklist';
import {TranslateFunction} from '@/shared/types/common';
import {formatDate, isValidDate} from '@/shared/utils/dateUtils';

/**
 * Questions in a template. 0 when the payload carries no sections, as the
 * submissions list endpoint's copy of the template does not.
 */
export const countTemplateQuestions = ({template}: {template: any}): number => {
  const sections = Array.isArray(template?.sections) ? template.sections : [];

  return sections.reduce(
    (total: number, section: any) =>
      total +
      (Array.isArray(section?.questions) ? section.questions.length : 0),
    0
  );
};

export const transformAssessmentChecklistResponse = ({
  checklist,
}: {
  checklist: AssessmentTemplateApi;
}): AssessmentChecklist => {
  const sections = Array.isArray(checklist.sections) ? checklist.sections : [];

  return {
    id: checklist.id,
    name: checklist.title || ASSESSMENT_CHECKLIST_DEFAULTS.emptyText,
    description:
      checklist.description || ASSESSMENT_CHECKLIST_DEFAULTS.emptyText,
    sectionCount: sections.length,
    questionCount: countTemplateQuestions({template: checklist}),
    status: checklist.status,
    type: checklist.type,
    createdAt: checklist.createdAt,
  };
};

export const getChecklistStatusConfig = ({
  status,
}: {
  status: AssessmentChecklistStatus;
}) =>
  Object.values(ASSESSMENT_CHECKLIST_STATUS).find(
    (config) => config.value === status
  ) ?? ASSESSMENT_CHECKLIST_STATUS.DRAFT;

export const getChecklistTypeLabelKey = ({
  type,
}: {
  type: ChecklistTemplateType;
}): string =>
  Object.values(CHECKLIST_TEMPLATE_TYPES).find(
    (config) => config.value === type
  )?.labelKey ?? CHECKLIST_TEMPLATE_TYPES.PATIENT.labelKey;

const normalizeAssessmentChecklistOptions = ({
  options,
}: {
  options: unknown;
}): ChecklistOptionItem[] => {
  if (!Array.isArray(options)) return [];

  return options.filter((option): option is ChecklistOptionItem => {
    if (typeof option === 'string') return true;
    if (option === null) return false;
    if (typeof option !== 'object') return false;
    if (!('title' in option)) return false;

    return typeof (option as {title: unknown}).title === 'string';
  });
};

export const optionToValue = ({option}: {option: ChecklistOption}) => ({
  title: option.value,
  flag: option.flag,
  points: option.points,
});

const normalizeQuestionType = ({type}: {type: unknown}): ChecklistFieldType => {
  return Object.values(CHECKLIST_FIELD_TYPES).includes(
    type as ChecklistFieldType
  )
    ? (type as ChecklistFieldType)
    : ASSESSMENT_CHECKLIST_DEFAULTS.questionType;
};

export const getOptionLabel = ({item}: {item: unknown}): string =>
  item !== null && typeof item === 'object' && 'title' in item
    ? String((item as {title: unknown}).title)
    : String(item);

export const isPainLevelQuestion = ({title}: {title: string}): boolean => {
  return title.toLowerCase().includes('pain level');
};

export const isValueValid = ({value}: {value: unknown}): boolean => {
  return value !== null && value !== undefined && value !== '';
};

export const calculatePainLevelScore = ({
  value,
}: {
  value: number;
}): ScoredAnswerValue | null => {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < PAIN_LEVEL_SCORE.MIN_VALUE ||
    value > PAIN_LEVEL_SCORE.MAX_VALUE
  ) {
    return null;
  }

  if (value >= PAIN_LEVEL_SCORE.RED_THRESHOLD) {
    return {
      flag: RISK_FLAGS.RED,
      title: value,
      points: PAIN_LEVEL_SCORE.RED_POINTS,
    };
  }
  if (value >= PAIN_LEVEL_SCORE.YELLOW_THRESHOLD) {
    return {
      flag: RISK_FLAGS.YELLOW,
      title: value,
      points: PAIN_LEVEL_SCORE.YELLOW_POINTS,
    };
  }

  return {
    flag: RISK_FLAGS.GREEN,
    title: value,
    points: PAIN_LEVEL_SCORE.GREEN_POINTS,
  };
};

export const transformAssessmentChecklistDetailsResponse = ({
  checklist,
}: {
  checklist: AssessmentTemplateApi;
}): AssessmentChecklistDetails => {
  const sections = Array.isArray(checklist.sections) ? checklist.sections : [];

  return {
    id: checklist.id,
    title: checklist.title || ASSESSMENT_CHECKLIST_DEFAULTS.emptyText,
    description:
      checklist.description || ASSESSMENT_CHECKLIST_DEFAULTS.emptyText,
    status: checklist.status,
    type: checklist.type,
    sections: sections.map((section) => {
      const questions = Array.isArray(section.questions)
        ? section.questions
        : [];

      return {
        id: section.id,
        title: section.title || ASSESSMENT_CHECKLIST_DEFAULTS.emptyText,
        sortOrder: section.sortOrder || ASSESSMENT_CHECKLIST_DEFAULTS.sortOrder,
        questions: questions.map((question) => ({
          id: question.id,
          title: question.title || ASSESSMENT_CHECKLIST_DEFAULTS.emptyText,
          type: normalizeQuestionType({type: question.type}),
          required: Boolean(question.required),
          options: normalizeAssessmentChecklistOptions({
            options: question.options,
          }),
          sortOrder:
            question.sortOrder || ASSESSMENT_CHECKLIST_DEFAULTS.sortOrder,
        })),
      };
    }),
  };
};

/** The titles a multi select holds, or nothing when the value is not a list. */
export const parseMultiSelectValue = ({value}: {value: string}): string[] => {
  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** An answer counts once it holds something the nurse can read. */
export const isAnswerEmpty = ({
  question,
  value = '',
}: {
  question: ChecklistQuestion;
  value?: string;
}): boolean => {
  if (value.length === 0) return true;

  if (question.type === CHECKLIST_FIELD_TYPES.MULTI_SELECT) {
    return parseMultiSelectValue({value}).length === 0;
  }

  return false;
};

/** Whether the form may move on: a required question needs an answer. */
export const isQuestionSatisfied = ({
  question,
  value,
}: {
  question: ChecklistQuestion;
  value?: string;
}): boolean => {
  if (!question.required) return true;

  return !isAnswerEmpty({question, value});
};

/** A boolean or checkbox answer, in any of the encodings the API has used. */
export const isYesAnswer = ({
  value,
  type,
}: {
  value: unknown;
  type: string;
}): boolean =>
  value === true ||
  value === 'true' ||
  (type === CHECKLIST_FIELD_TYPES.CHECKBOX && value === 'yes');

/**
 * An answer as a person reads it: yes or no, option labels joined, a short
 * date. Takes both the form's string encoding and the value the API stores,
 * so the runner's summary and a submission's detail say the same thing.
 */
export const formatAnswerValue = ({
  value,
  type,
  options = [],
  t,
}: {
  value: unknown;
  type: string;
  options?: ChecklistOption[];
  t: TranslateFunction;
}): string => {
  if (value === null || value === undefined || value === '') return '';

  if (
    type === CHECKLIST_FIELD_TYPES.BOOLEAN ||
    type === CHECKLIST_FIELD_TYPES.CHECKBOX
  ) {
    return isYesAnswer({value, type})
      ? t('commonContent.yes')
      : t('commonContent.no');
  }

  const labelFor = ({item}: {item: unknown}) => {
    const title = getOptionLabel({item});

    return options.find((option) => option.value === title)?.label || title;
  };

  if (type === CHECKLIST_FIELD_TYPES.MULTI_SELECT) {
    const items = Array.isArray(value)
      ? value
      : parseMultiSelectValue({value: String(value)});

    return items.map((item) => labelFor({item})).join(', ');
  }

  if (type === CHECKLIST_FIELD_TYPES.DATE) {
    const date = String(value);

    return isValidDate({date})
      ? formatDate({date, format: 'dd MMM yyyy'})
      : date;
  }

  return labelFor({item: value});
};

/**
 * One answer as the scoring engine wants it. An option the caregiver picked
 * goes back as the rich {title, flag, points} object, a pain level as its
 * score, anything else as the raw text.
 *
 * `scoreOnlySelect` keeps the section form's older rule, where only a SELECT
 * is matched against its options and every other type sends the raw text.
 */
export const buildAnswerValue = ({
  question,
  raw,
  scoreOnlySelect = false,
}: {
  question?: ChecklistQuestion;
  raw: string | null;
  scoreOnlySelect?: boolean;
}): any => {
  let value: any = raw;

  if (value && question?.options.length) {
    if (question.type === CHECKLIST_FIELD_TYPES.MULTI_SELECT) {
      // Anything but a JSON array is not a multi-select answer.
      let titles: unknown = null;

      try {
        titles = JSON.parse(value);
      } catch {
        titles = null;
      }

      value = Array.isArray(titles)
        ? titles.map((title) => {
            const option = question.options.find(
              (item) => item.value === title
            );

            return option ? optionToValue({option}) : {title};
          })
        : null;
    } else if (
      !scoreOnlySelect ||
      question.type === CHECKLIST_FIELD_TYPES.SELECT
    ) {
      // Any question that carries options is scored off the option it
      // matched, not off the raw text: a plain string reaches the engine with
      // no flag and no points.
      const option = question.options.find((item) => item.value === value);

      if (option) value = optionToValue({option});
    }
  }

  if (
    isValueValid({value}) &&
    question?.type === CHECKLIST_FIELD_TYPES.NUMBER &&
    isPainLevelQuestion({title: question.title})
  ) {
    const numericValue = Number(value);

    if (!Number.isNaN(numericValue)) {
      const score = calculatePainLevelScore({value: numericValue});

      if (score !== null && score !== undefined) value = score;
    }
  }

  return value;
};

/**
 * The multipart body of a checklist submission: any leading plain fields,
 * the `answers` JSON string, then one `images_{questionId}` entry per photo.
 * Entries and photos go in the order they are given.
 */
export const buildSubmissionFormData = ({
  questions,
  answers,
  attachments,
  fields = {},
  scoreOnlySelect = false,
}: {
  questions: ChecklistQuestion[];
  answers: SubmissionAnswerInput[];
  attachments: SubmissionAttachmentInput[];
  fields?: Record<string, string>;
  scoreOnlySelect?: boolean;
}): FormData => {
  const questionById = new Map(
    questions.map((question) => [question.id, question])
  );

  const submissionAnswers = answers.map(({questionId, value, comment}) => ({
    questionId,
    value: buildAnswerValue({
      question: questionById.get(questionId),
      raw: value,
      scoreOnlySelect,
    }),
    comment,
  }));

  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));

  formData.append('answers', JSON.stringify(submissionAnswers));

  attachments.forEach(({questionId, file}) => {
    formData.append(`images_${questionId}`, file);
  });

  return formData;
};

// Section notes and photos travel on each section's first question.
export const buildSectionChecklistFormData = ({
  sections,
  answers,
  sectionComments,
  sectionAttachments,
  fields,
  scoreOnlySelect,
}: SectionChecklistFormDataInput): FormData => {
  const firstQuestionBySection: Record<string, string> = {};

  sections.forEach((section) => {
    if (section.questions.length > 0)
      firstQuestionBySection[section.id] = section.questions[0].id;
  });

  const commentByQuestion: Record<string, string> = {};

  Object.entries(sectionComments).forEach(([sectionId, comment]) => {
    const questionId = firstQuestionBySection[sectionId];
    if (questionId && comment) commentByQuestion[questionId] = comment;
  });

  return buildSubmissionFormData({
    questions: sections.flatMap((section) => section.questions),
    answers: answers.map((answer) => ({
      questionId: answer.questionId,
      value: answer.selectedOption || null,
      comment: commentByQuestion[answer.questionId] || null,
    })),
    attachments: Object.entries(sectionAttachments).flatMap(
      ([sectionId, attachments]) => {
        const questionId = firstQuestionBySection[sectionId];

        return questionId
          ? attachments.map((attachment) => ({
              questionId,
              file: attachment.file,
            }))
          : [];
      }
    ),
    fields,
    scoreOnlySelect,
  });
};

// Stored answers grouped under their question's section, in answer order.
export const groupAnswersBySection = <T extends SectionedAnswer>({
  answers,
  fallbackTitle,
}: {
  answers: T[];
  fallbackTitle: string;
}): {sectionTitle: string; answers: T[]}[] =>
  Object.entries(
    answers.reduce<Record<string, T[]>>((acc, answer) => {
      const key = answer.question?.section?.title || fallbackTitle;
      (acc[key] ??= []).push(answer);

      return acc;
    }, {})
  ).map(([sectionTitle, sectionAnswers]) => ({
    sectionTitle,
    answers: sectionAnswers,
  }));
