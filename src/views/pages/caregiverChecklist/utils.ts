import {CHECKLIST_FIELD_TYPES} from '@/shared/interfaces/assessmentChecklistDetails';
import {
  ChecklistRunner,
  RunnerAnswer,
  RunnerAnswers,
  RunnerQuestion,
  RunnerSectionGroup,
} from '@/shared/interfaces/caregiverChecklistRunner';
import {ChecklistSection} from '@/shared/interfaces/checklist';
import {TranslateFunction} from '@/shared/types/common';
import {
  getOptionLabel,
  isAnswerEmpty,
} from '@/shared/utils/assessmentChecklistUtils';

/**
 * A fresh blank answer. Built each time rather than shared, so no two
 * questions can end up pointing at the same `attachments` array.
 */
export const createEmptyAnswer = (): RunnerAnswer => ({
  value: '',
  comment: '',
  attachments: [],
});

/** Every question in template order, each one told which section it is in. */
export const flattenRunnerQuestions = ({
  sections,
}: {
  sections: ChecklistSection[];
}): RunnerQuestion[] =>
  sections.flatMap((section, sectionIndex) =>
    section.questions.map((question) => ({
      ...question,
      sectionId: section.id,
      sectionTitle: section.title,
      sectionIndex,
      placeholder: question.placeholder || '',
    }))
  );

/** The questions back in their sections, for the rail and the summary. */
export const groupQuestionsBySection = ({
  questions,
}: {
  questions: RunnerQuestion[];
}): RunnerSectionGroup[] =>
  questions.reduce<RunnerSectionGroup[]>((groups, question) => {
    const last = groups[groups.length - 1];

    if (last && last.sectionIndex === question.sectionIndex) {
      last.items.push(question);

      return groups;
    }

    groups.push({
      sectionIndex: question.sectionIndex,
      title: question.sectionTitle,
      items: [question],
    });

    return groups;
  }, []);

export const countAnswered = ({
  questions,
  answers,
}: {
  questions: RunnerQuestion[];
  answers: RunnerAnswers;
}): number =>
  questions.filter(
    (question) => !isAnswerEmpty({question, value: answers[question.id]?.value})
  ).length;

/**
 * What the primary button does next: Save when she came from the summary to
 * fix one answer, Go to summary on the last question, Next otherwise.
 */
export const getPrimaryActionLabel = ({
  runner,
  t,
}: {
  runner: ChecklistRunner;
  t: TranslateFunction;
}): string => {
  if (runner.isEditingFromSummary) return t('caregiverChecklist.save');

  if (runner.currentIndex === runner.questions.length - 1) {
    return t('caregiverChecklist.goToSummary');
  }

  return t('commonContent.next');
};

/**
 * Turns a value the API already stored back into the string encoding the
 * runner works in, so reopening a part filled checklist shows the answers.
 */
const toRunnerValue = ({
  question,
  value,
}: {
  question: RunnerQuestion;
  value: unknown;
}): string => {
  if (value === null || value === undefined || value === '') return '';

  if (question.type === CHECKLIST_FIELD_TYPES.BOOLEAN) {
    return value === true || value === 'true' ? 'true' : 'false';
  }

  if (question.type === CHECKLIST_FIELD_TYPES.CHECKBOX) {
    return value === true || value === 'true' || value === 'yes' ? 'yes' : 'no';
  }

  if (question.type === CHECKLIST_FIELD_TYPES.MULTI_SELECT) {
    const items = Array.isArray(value) ? value : [value];

    return JSON.stringify(items.map((item) => getOptionLabel({item})));
  }

  return getOptionLabel({item: value});
};

/** Answers the submission already holds, keyed by question. */
export const seedAnswersFromSubmission = ({
  questions,
  submissionAnswers,
}: {
  questions: RunnerQuestion[];
  submissionAnswers: any[];
}): RunnerAnswers => {
  const answers: RunnerAnswers = {};

  questions.forEach((question) => {
    const stored = submissionAnswers.find(
      (item) => item?.questionId === question.id
    );

    answers[question.id] = {
      value: stored ? toRunnerValue({question, value: stored.value}) : '',
      comment: stored?.comment || '',
      attachments: [],
    };
  });

  return answers;
};
