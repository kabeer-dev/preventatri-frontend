'use client';

import {useCallback, useEffect, useRef} from 'react';

import {ChecklistRunner} from '@/shared/interfaces/caregiverChecklistRunner';
import {isQuestionSatisfied} from '@/shared/utils/assessmentChecklistUtils';

interface Params {
  runner: ChecklistRunner;

  /** The phone is driven by taps alone, so only the desktop turns this on. */
  isEnabled: boolean;
}

/** One answer option the arrow keys can move between. */
const OPTION_SELECTOR = '[role="radio"], [role="checkbox"]';

/** The field a text, number or date question opens on. */
const FIELD_SELECTOR =
  '[data-runner-input] input:not([type="hidden"]), [data-runner-input] textarea';

/** Keys that move between options, and how far each one goes. */
const MOVE_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

const isTypingTarget = ({target}: {target: EventTarget | null}) => {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA'
  );
};

/**
 * The desktop runner's keyboard: arrows walk the options of the question in
 * view, arriving at a question puts the caret where the answer goes, and
 * Cmd or Ctrl with Enter is the Next button. It lives here rather than in the
 * renderer so the two screens that answer to it behave the same way.
 *
 * Attach the returned ref to the element that holds the question.
 */
const useRunnerKeyboard = ({runner, isEnabled}: Params) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {mode, currentQuestion, questions, answers, next, submit} = runner;

  const currentQuestionId = currentQuestion?.id;

  const getOptions = useCallback(
    () =>
      Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(OPTION_SELECTOR) ||
          []
      ),
    []
  );

  // Opening a question hands her the answer: the first option of a choice, or
  // the caret of a field, so nothing needs the mouse to get started.
  useEffect(() => {
    if (!isEnabled || mode !== 'question') return;

    const options = getOptions();

    if (options.length > 0) {
      const selected = options.find(
        (option) => option.getAttribute('aria-checked') === 'true'
      );

      (selected || options[0]).focus();

      return;
    }

    containerRef.current?.querySelector<HTMLElement>(FIELD_SELECTOR)?.focus();
  }, [currentQuestionId, getOptions, isEnabled, mode]);

  useEffect(() => {
    if (!isEnabled) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      // The one shortcut that still works while she is typing a comment.
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();

        if (mode !== 'summary') {
          next();

          return;
        }

        const isComplete = questions.every((question) =>
          isQuestionSatisfied({question, value: answers[question.id]?.value})
        );

        if (isComplete) submit();

        return;
      }

      if (mode !== 'question') return;

      if (!MOVE_KEYS.includes(event.key)) return;

      if (isTypingTarget({target: event.target})) return;

      const options = getOptions();

      if (options.length === 0) return;

      const last = options.length - 1;

      const activeIndex = options.indexOf(
        document.activeElement as HTMLElement
      );

      let index = activeIndex < 0 ? 0 : activeIndex;

      if (event.key === 'ArrowDown') index = Math.min(activeIndex + 1, last);

      if (event.key === 'ArrowUp') index = Math.max(activeIndex - 1, 0);

      if (event.key === 'Home') index = 0;

      if (event.key === 'End') index = last;

      event.preventDefault();

      const option = options[index];

      option.focus();

      // One answer follows the focus. A multi select waits for Space or
      // Enter, which the option button already answers to itself.
      if (option.getAttribute('role') === 'radio') option.click();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answers, getOptions, isEnabled, mode, next, questions, submit]);

  return {containerRef};
};

export default useRunnerKeyboard;
