'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {MAX_UPLOAD_IMAGES} from '@/shared/constants/common';
import {
  ChecklistRunnerState,
  RunnerAnswer,
  RunnerAnswers,
  RunnerMode,
  RunnerQuestion,
} from '@/shared/interfaces/caregiverChecklistRunner';
import {
  buildSubmissionFormData,
  isQuestionSatisfied,
} from '@/shared/utils/assessmentChecklistUtils';
import {getCurrentDateTime} from '@/shared/utils/dateUtils';
import {
  countAnswered,
  createEmptyAnswer,
} from '@/views/pages/caregiverChecklist/utils';

interface Params {
  questions: RunnerQuestion[];

  /** What the submission already held, read once when the runner mounts. */
  seededAnswers: RunnerAnswers;
  onSubmit: ({formData}: {formData: FormData}) => void;
}

/**
 * The checklist runner's state machine: one flat list of questions, where the
 * caregiver is in it, what she has answered, and which screen that adds up to.
 * Both renderers read this and neither one keeps state of its own.
 */
const useChecklistRunner = ({questions, seededAnswers, onSubmit}: Params) => {
  const [answers, setAnswers] = useState<RunnerAnswers>(seededAnswers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [isBlocked, setIsBlocked] = useState(false);

  const [mode, setMode] = useState<RunnerMode>('question');
  const [sentAt, setSentAt] = useState<string | null>(null);

  // Set when the caregiver came to a question from the summary's Change
  // button. She is fixing one answer, not walking the checklist again, so the
  // primary button takes her straight back to the summary.
  const [isEditingFromSummary, setIsEditingFromSummary] = useState(false);

  // The live answers, mirrored so the unmount cleanup can revoke every preview
  // URL without re-running each time one of them changes.
  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(
    () => () => {
      Object.values(answersRef.current).forEach(({attachments}) =>
        attachments.forEach(({previewUrl}) => URL.revokeObjectURL(previewUrl))
      );
    },
    []
  );

  // The question in view is remembered by id, so a template refetch that
  // reorders or drops questions keeps her on the same one, or the nearest.
  const currentQuestionIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const id = currentQuestionIdRef.current;
    const foundIndex = id ? questions.findIndex((q) => q.id === id) : -1;
    const lastIndex = Math.max(questions.length - 1, 0);

    setCurrentIndex((index) =>
      foundIndex >= 0 ? foundIndex : Math.min(index, lastIndex)
    );
  }, [questions]);

  useEffect(() => {
    currentQuestionIdRef.current = questions[currentIndex]?.id;
  }, [currentIndex, questions]);

  const currentQuestion = questions[currentIndex];

  /**
   * The answer for one question, always a real answer.
   *
   * `answers` is seeded once, while `questions` is rebuilt whenever the
   * template is refetched. A template that grew a question would leave that
   * question without an entry, so every read goes through here and gets a
   * blank answer rather than nothing at all.
   */
  const getAnswer = useCallback(
    ({questionId}: {questionId: string}): RunnerAnswer =>
      answers[questionId] || createEmptyAnswer(),
    [answers]
  );

  const answeredCount = useMemo(
    () => countAnswered({questions, answers}),
    [answers, questions]
  );

  const setAnswer = useCallback(
    ({questionId, value}: {questionId: string; value: string}) => {
      setIsBlocked(false);
      setAnswers((previous) => ({
        ...previous,
        [questionId]: {...(previous[questionId] || createEmptyAnswer()), value},
      }));
    },
    []
  );

  const setComment = useCallback(
    ({questionId, comment}: {questionId: string; comment: string}) => {
      setAnswers((previous) => ({
        ...previous,
        [questionId]: {
          ...(previous[questionId] || createEmptyAnswer()),
          comment,
        },
      }));
    },
    []
  );

  const addAttachments = useCallback(
    ({questionId, files}: {questionId: string; files: File[]}) => {
      const existing = answersRef.current[questionId]?.attachments || [];

      const room = MAX_UPLOAD_IMAGES - existing.length;

      if (room <= 0 || files.length === 0) return;

      // Made here and only here, so a re-render can never mint a second URL
      // for the same photo and leak the first one.
      const added = files.slice(0, room).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setAnswers((previous) => {
        const answer = previous[questionId] || createEmptyAnswer();

        return {
          ...previous,
          [questionId]: {
            ...answer,
            attachments: [...answer.attachments, ...added],
          },
        };
      });
    },
    []
  );

  const removeAttachment = useCallback(
    ({questionId, previewUrl}: {questionId: string; previewUrl: string}) => {
      URL.revokeObjectURL(previewUrl);
      setAnswers((previous) => {
        const answer = previous[questionId] || createEmptyAnswer();

        return {
          ...previous,
          [questionId]: {
            ...answer,
            attachments: answer.attachments.filter(
              (attachment) => attachment.previewUrl !== previewUrl
            ),
          },
        };
      });
    },
    []
  );

  const goTo = useCallback(
    ({questionId}: {questionId: string}) => {
      const index = questions.findIndex(
        (question) => question.id === questionId
      );

      if (index < 0) return;

      setIsBlocked(false);
      setCurrentIndex(index);
      setMode('question');
    },
    [questions]
  );

  const editFromSummary = useCallback(
    ({questionId}: {questionId: string}) => {
      setIsEditingFromSummary(true);
      goTo({questionId});
    },
    [goTo]
  );

  const goToSummary = useCallback(() => {
    setIsBlocked(false);
    setIsEditingFromSummary(false);
    setMode('summary');
  }, []);

  const next = useCallback(() => {
    if (!currentQuestion) return;

    if (
      !isQuestionSatisfied({
        question: currentQuestion,
        value: answers[currentQuestion.id]?.value,
      })
    ) {
      setIsBlocked(true);

      return;
    }

    setIsBlocked(false);
    setVisited((previous) => new Set(previous).add(currentQuestion.id));

    // She came here to fix one answer, so saving it takes her back to the
    // summary rather than on to the next question.
    if (isEditingFromSummary) {
      setIsEditingFromSummary(false);
      setMode('summary');

      return;
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= questions.length) {
      setMode('summary');

      return;
    }

    setCurrentIndex(nextIndex);
    setMode('question');
  }, [answers, currentIndex, currentQuestion, isEditingFromSummary, questions]);

  const previous = useCallback(() => {
    setIsBlocked(false);
    setMode('question');
    setCurrentIndex((index) => Math.max(0, index - 1));
  }, []);

  const backToQuestions = useCallback(() => {
    setMode('question');
  }, []);

  // One entry per question in template order, and the photos in the same
  // order, so the body matches what the section form sends.
  const submit = useCallback(() => {
    const formData = buildSubmissionFormData({
      questions,
      answers: questions.map((question) => ({
        questionId: question.id,
        value: answers[question.id]?.value || null,
        comment: answers[question.id]?.comment || null,
      })),
      attachments: questions.flatMap((question) =>
        (answers[question.id]?.attachments || []).map(({file}) => ({
          questionId: question.id,
          file,
        }))
      ),
    });

    onSubmit({formData});
  }, [answers, onSubmit, questions]);

  const markSent = useCallback(() => {
    setSentAt(getCurrentDateTime());
    setMode('sent');
  }, []);

  const state: ChecklistRunnerState = {
    questions,
    currentIndex,
    currentQuestion,
    answers,
    visited,
    mode,
    answeredCount,
    sentAt,
    isBlocked,
    isEditingFromSummary,
  };

  return {
    ...state,
    getAnswer,
    next,
    previous,
    goTo,
    editFromSummary,
    goToSummary,
    backToQuestions,
    setAnswer,
    setComment,
    addAttachments,
    removeAttachment,
    submit,
    markSent,
  };
};

export default useChecklistRunner;
