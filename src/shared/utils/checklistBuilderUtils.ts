import {
  CHECKLIST_CHOICE_FIELD_TYPES,
  CHECKLIST_OPTION_FLAGS,
  CHECKLIST_TEMPLATE_TYPES,
} from '@/shared/constants/assessmentChecklists';
import {
  CHECKLIST_BUILDER_DEFAULT_QUESTION_TYPE,
  CHECKLIST_BUILDER_EMPTY_TEXT,
  CHECKLIST_SECTION_NUMBER_LENGTH,
} from '@/shared/constants/checklistBuilder';
import {RISK_FLAGS} from '@/shared/constants/submissions';
import {
  AssessmentTemplateApi,
  AssessmentTemplateOptionApi,
  ChecklistOptionFlag,
  ChecklistTemplateType,
} from '@/shared/interfaces/assessmentChecklist';
import {
  ChecklistBuilderFormValues,
  ChecklistBuilderOptionForm,
  ChecklistBuilderQuestionForm,
  ChecklistBuilderSectionForm,
  ChecklistStructureStats,
  ChecklistTemplateContentPayload,
  ChecklistTemplateCreatePayload,
  NewChecklistFormValues,
} from '@/shared/types/checklistBuilder';
import {TranslateFunction} from '@/shared/types/common';

const bySortOrder = ({
  a,
  b,
}: {
  a: {sortOrder: number};
  b: {sortOrder: number};
}) => a.sortOrder - b.sortOrder;

const normalizeTitle = ({title}: {title: string}) => title.trim().toLowerCase();

// Case-insensitive, matching how the backend compares titles.
export const hasDuplicateTitles = ({items}: {items: {title: string}[]}) => {
  // Blank titles are reported as missing text, not as duplicates.
  const titles = items
    .map((item) => normalizeTitle({title: item.title}))
    .filter(Boolean);

  return new Set(titles).size !== titles.length;
};

export const isChoiceQuestion = ({type}: {type: string}) =>
  CHECKLIST_CHOICE_FIELD_TYPES.includes(type);

export const isPatientChecklist = ({type}: {type: ChecklistTemplateType}) =>
  type === CHECKLIST_TEMPLATE_TYPES.PATIENT.value;

const toFormFlag = ({
  option,
}: {
  option: AssessmentTemplateOptionApi;
}): ChecklistBuilderOptionForm['flag'] =>
  CHECKLIST_OPTION_FLAGS.find((flag) => flag === option.flag) ??
  CHECKLIST_BUILDER_EMPTY_TEXT;

export const createEmptyOption = (): ChecklistBuilderOptionForm => ({
  title: CHECKLIST_BUILDER_EMPTY_TEXT,
  flag: CHECKLIST_BUILDER_EMPTY_TEXT,
});

export const createEmptyQuestion = (): ChecklistBuilderQuestionForm => ({
  title: CHECKLIST_BUILDER_EMPTY_TEXT,
  type: CHECKLIST_BUILDER_DEFAULT_QUESTION_TYPE,
  required: true,
  options: [createEmptyOption()],
});

export const createEmptySection = (): ChecklistBuilderSectionForm => ({
  title: CHECKLIST_BUILDER_EMPTY_TEXT,
  questions: [createEmptyQuestion()],
});

export const templateToBuilderForm = ({
  template,
}: {
  template: AssessmentTemplateApi;
}): ChecklistBuilderFormValues => ({
  title: template.title,
  description: template.description ?? CHECKLIST_BUILDER_EMPTY_TEXT,
  sections: [...template.sections]
    .sort((a, b) => bySortOrder({a, b}))
    .map((section) => ({
      title: section.title,
      questions: [...section.questions]
        .sort((a, b) => bySortOrder({a, b}))
        .map((question) => ({
          title: question.title,
          type: question.type,
          required: question.required,
          options: (question.options ?? []).map((option) => ({
            title: option.title,
            flag: toFormFlag({option}),
          })),
        })),
    })),
});

// Flags only matter on patient checklists and answers only on choice questions,
// so both are dropped elsewhere rather than stored as dead data.
export const builderFormToContentPayload = ({
  values,
  type,
}: {
  values: ChecklistBuilderFormValues;
  type: ChecklistTemplateType;
}): ChecklistTemplateContentPayload => ({
  title: values.title.trim(),
  description: values.description.trim() || null,
  sections: values.sections.map((section) => ({
    title: section.title.trim(),
    questions: section.questions.map((question) => ({
      title: question.title.trim(),
      type: question.type,
      required: question.required,
      options: isChoiceQuestion({type: question.type})
        ? question.options.map((option) =>
            option.flag && isPatientChecklist({type})
              ? {title: option.title.trim(), flag: option.flag}
              : {title: option.title.trim()}
          )
        : [],
    })),
  })),
});

// A copied template brings its sections, questions and flags into the new draft.
export const buildCreateTemplatePayload = ({
  values,
  type,
  source,
}: {
  values: NewChecklistFormValues;
  type: ChecklistTemplateType;
  source?: AssessmentTemplateApi;
}): ChecklistTemplateCreatePayload => ({
  ...builderFormToContentPayload({
    values: {
      title: values.title,
      description: values.description,
      sections: source
        ? templateToBuilderForm({template: source}).sections
        : [],
    },
    type,
  }),
  type,
});

export const getSectionNumber = ({sectionIndex}: {sectionIndex: number}) =>
  String(sectionIndex + 1).padStart(CHECKLIST_SECTION_NUMBER_LENGTH, '0');

export const getQuestionNumber = ({
  sectionIndex,
  questionIndex,
}: {
  sectionIndex: number;
  questionIndex: number;
}) => `${sectionIndex + 1}.${questionIndex + 1}`;

export const getQuestionFlags = ({
  question,
}: {
  question: ChecklistBuilderQuestionForm;
}): ChecklistOptionFlag[] =>
  isChoiceQuestion({type: question.type})
    ? [...CHECKLIST_OPTION_FLAGS]
        .reverse()
        .filter((flag) =>
          question.options.some((option) => option.flag === flag)
        )
    : [];

export const getChecklistStructureStats = ({
  values,
}: {
  values: ChecklistBuilderFormValues;
}): ChecklistStructureStats => {
  const questions = values.sections.flatMap((section) => section.questions);

  const countRaising = ({flag}: {flag: ChecklistOptionFlag}) =>
    questions.filter((question) => getQuestionFlags({question}).includes(flag))
      .length;

  return {
    sections: values.sections.length,
    items: questions.length,
    requiredItems: questions.filter((question) => question.required).length,
    canRaiseRed: countRaising({flag: RISK_FLAGS.RED}),
    canRaiseYellow: countRaising({flag: RISK_FLAGS.YELLOW}),
  };
};

const getQuestionIssues = ({
  question,
  item,
  type,
  t,
}: {
  question: ChecklistBuilderQuestionForm;
  item: string;
  type: ChecklistTemplateType;
  t: TranslateFunction;
}): string[] => {
  const issues: string[] = [];

  const issueText = ({key}: {key: string}) =>
    t(`assessmentChecklists.builder.issues.${key}`, {item});

  if (!question.title.trim()) issues.push(issueText({key: 'itemNoText'}));

  if (!isChoiceQuestion({type: question.type})) return issues;

  const {options} = question;

  if (options.length === 0) issues.push(issueText({key: 'itemNoAnswers'}));
  if (options.some((option) => !option.title.trim()))
    issues.push(issueText({key: 'answerNoText'}));
  if (hasDuplicateTitles({items: options}))
    issues.push(issueText({key: 'duplicateAnswers'}));
  if (isPatientChecklist({type}) && options.some((option) => !option.flag))
    issues.push(issueText({key: 'answerNoFlag'}));

  return issues;
};

// Mirrors the backend's publish check so admins see every blocker up front.
export const getChecklistPublishIssues = ({
  values,
  type,
  t,
}: {
  values: ChecklistBuilderFormValues;
  type: ChecklistTemplateType;
  t: TranslateFunction;
}): string[] => {
  const baseIssues: string[] = [];

  if (!values.title.trim())
    baseIssues.push(t('assessmentChecklists.builder.issues.noTitle'));

  if (values.sections.length === 0)
    return baseIssues.concat(
      t('assessmentChecklists.builder.issues.noSections')
    );

  const sectionIssues = values.sections.flatMap((section, sectionIndex) => {
    const sectionNumber = sectionIndex + 1;
    const issues: string[] = [];

    if (!section.title.trim())
      issues.push(
        t('assessmentChecklists.builder.issues.sectionNoTitle', {
          section: sectionNumber,
        })
      );

    if (section.questions.length === 0)
      issues.push(
        t('assessmentChecklists.builder.issues.sectionEmpty', {
          section: sectionNumber,
        })
      );

    return issues.concat(
      section.questions.flatMap((question, questionIndex) =>
        getQuestionIssues({
          question,
          item: getQuestionNumber({sectionIndex, questionIndex}),
          type,
          t,
        })
      )
    );
  });

  const issues = baseIssues.concat(sectionIssues);

  return hasDuplicateTitles({items: values.sections})
    ? issues.concat(t('assessmentChecklists.builder.issues.duplicateSections'))
    : issues;
};
