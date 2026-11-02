import {SubmissionStatus} from '@/shared/interfaces/submission';

/**
 * One checklist due, flattened for every caregiver screen. Built once in
 * `toCaregiverChecklist` so Today, Patients and the patient page cannot drift
 * apart on what "late" or "sent" means.
 */
export interface CaregiverChecklist {
  id: string;
  patientId: string;

  /** "Last, First", the way every caregiver list names a patient. */
  patientName: string;
  checklistName: string;
  status: SubmissionStatus;
  dueDate: string | null;
  deadline: string | null;
  submittedAt: string | null;

  /**
   * Questions in the checklist. 0 when the list endpoint did not carry the
   * template's sections, which is why every "n questions" line is hidden at 0
   * rather than showing a made-up number.
   */
  questionCount: number;

  /** The admin's note on the assignment. Empty unless the API carried it. */
  assignmentNote: string;

  isSent: boolean;

  /** True while the API would still accept an answer, so it counts as work. */
  isOpen: boolean;

  /** Not started yet and not refused: the patient page's "Next {day}" line. */
  isUpcoming: boolean;
  isLate: boolean;
  isDueToday: boolean;
  isSentToday: boolean;
}

/** What one patient owes today, derived from that patient's checklists. */
/** Whether the workload behind a patient list is known yet. */
export type CaregiverWorkloadStatus = 'loading' | 'error' | 'ready';

export interface CaregiverPatientWorkload {
  lateCount: number;
  dueTodayCount: number;
  firstLateName: string;
  firstDueTodayName: string;
}

/** One figure in Today's count strip: "3 pending assessments", "1 late". */
export interface CaregiverTodayCount {
  key: string;
  value: number;
  label: string;

  /** Reads in the danger colour: a late count above zero. */
  isCritical: boolean;
}

/** Everything the Today screen renders, derived once and shared by both shells. */
export interface CaregiverTodayViewProps {
  greeting: string;
  dateLabel: string;
  countEntries: CaregiverTodayCount[];
  late: CaregiverChecklist[];
  dueToday: CaregiverChecklist[];
  sentToday: CaregiverChecklist[];
  isLoading: boolean;
}
