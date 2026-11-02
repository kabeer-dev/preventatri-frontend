import {ChecklistQuestion} from '@/shared/interfaces/checklist';
import {DetailFact} from '@/shared/interfaces/uiComponents';

/**
 * One question of the checklist, flattened out of its section but still
 * carrying where it came from, so the rail, the progress segments and the
 * summary can all group by section without walking the template again.
 */
export interface RunnerQuestion extends ChecklistQuestion {
  sectionId: string;
  sectionTitle: string;

  /** 0 based position of the owning section in the template. */
  sectionIndex: number;

  /** Hint text the template already carries. Empty when it has none. */
  placeholder: string;
}

/** One section's questions, in order, for the rail and the summary. */
export interface RunnerSectionGroup {
  sectionIndex: number;
  title: string;
  items: RunnerQuestion[];
}

/**
 * One photo attached to an answer. The preview URL is made once, where the
 * file is added, and revoked where it is dropped, so no thumbnail ever owns
 * the lifetime of a URL it only displays.
 */
export interface RunnerAttachment {
  file: File;
  previewUrl: string;
}

/**
 * What the caregiver put on one question. `value` uses the same string
 * encoding the old form used, so the payload builder stays unchanged:
 * multi select is a JSON array of option titles, boolean is 'true' / 'false',
 * checkbox is 'yes' / 'no', everything else is the raw text.
 */
export interface RunnerAnswer {
  value: string;
  comment: string;

  /** Kept in memory only. The browser cannot store a File. */
  attachments: RunnerAttachment[];
}

export type RunnerAnswers = Record<string, RunnerAnswer>;

/** Which screen the runner is on. */
export type RunnerMode = 'question' | 'summary' | 'sent';

/** Everything a renderer needs from the state machine. */
export interface ChecklistRunnerState {
  questions: RunnerQuestion[];
  currentIndex: number;
  currentQuestion?: RunnerQuestion;
  answers: RunnerAnswers;
  visited: Set<string>;
  mode: RunnerMode;
  answeredCount: number;

  /** When the nurse got it, as an ISO string. Set once, on send. */
  sentAt: string | null;

  /** Set when Next was blocked by a required question with no answer. */
  isBlocked: boolean;

  /**
   * True while the caregiver is fixing one answer she reached from the
   * summary's Change button. The primary button saves back to the summary and
   * Previous is hidden.
   */
  isEditingFromSummary: boolean;
}

/** Everything a renderer can ask the state machine to do. */
export interface ChecklistRunnerActions {
  next: () => void;
  previous: () => void;
  goTo: ({questionId}: {questionId: string}) => void;
  editFromSummary: ({questionId}: {questionId: string}) => void;
  goToSummary: () => void;
  backToQuestions: () => void;
  setAnswer: ({questionId, value}: {questionId: string; value: string}) => void;
  setComment: ({
    questionId,
    comment,
  }: {
    questionId: string;
    comment: string;
  }) => void;
  addAttachments: ({
    questionId,
    files,
  }: {
    questionId: string;
    files: File[];
  }) => void;
  removeAttachment: ({
    questionId,
    previewUrl,
  }: {
    questionId: string;
    previewUrl: string;
  }) => void;
  submit: () => void;
  markSent: () => void;

  /** One question's answer, blank rather than missing. */
  getAnswer: ({questionId}: {questionId: string}) => RunnerAnswer;
}

export type ChecklistRunner = ChecklistRunnerState & ChecklistRunnerActions;

/** The question in view, with the label the shell writes above its title. */
export interface QuestionBodyProps {
  runner: ChecklistRunner;

  /** The phone shows the patient's name; the desktop the section and position. */
  label: string;
  isPhone: boolean;
}

/** The desktop rail beside the question: patient identity, facts and note. */
export interface RunnerPatientPanelProps {
  patientName: string;
  patientDetail: string;
  patientFacts?: DetailFact[];
  assignmentNote: string;
}

/** The one prop shape both renderers take. */
export interface RunnerViewProps {
  runner: ChecklistRunner;
  patientName: string;

  /** "84 · Dauphin County", or empty when neither is known. */
  patientDetail: string;

  /** Date of birth, gender, phone: listed under the name on the desktop rail. */
  patientFacts?: DetailFact[];
  checklistName: string;
  assignmentNote: string;
  isSubmitting: boolean;
  onSaveAndExit: () => void;

  /** The summary's send button; the caregiver's "Submit assessment" when unset. */
  submitLabel?: string;
}
