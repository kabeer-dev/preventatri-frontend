import {CHECKLIST_SUBMISSION_STATUS} from '@/shared/constants/assessmentChecklists';
import {
  CAREGIVER_DATE_FORMATS,
  CAREGIVER_GREETING_HOURS,
  CAREGIVER_OPEN_STATUSES,
  CAREGIVER_QUESTIONS_PER_MINUTE,
  CAREGIVER_SENT_STATUSES,
} from '@/shared/constants/caregiver';
import {DATE_FORMATS} from '@/shared/constants/common';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {
  CaregiverChecklist,
  CaregiverPatientWorkload,
} from '@/shared/interfaces/caregiverChecklist';
import {TranslateFunction} from '@/shared/types/common';
import {countTemplateQuestions} from '@/shared/utils/assessmentChecklistUtils';
import {
  formatDate,
  fromIso,
  isBeforeToday,
  isToday,
  isTodayOrFuture,
} from '@/shared/utils/dateUtils';
import {getFullName} from '@/shared/utils/general';

/**
 * The one rule for "the caregiver can still send this".
 *
 * The API accepts an answer only while the status is PENDING or LATE and the
 * deadline day has not gone by. Every caregiver screen asks this before it
 * offers a checklist as work, so she is never sent to one the API would
 * refuse. MISSED, VOIDED and SKIPPED all fail it, and so does a checklist
 * with no readable deadline: the API dates a submit against the deadline, so
 * one it cannot read is one it would refuse.
 */
export const isChecklistOpen = ({
  status,
  deadline,
}: {
  status?: string;
  deadline?: string | null;
}): boolean => {
  if (!status || !CAREGIVER_OPEN_STATUSES.includes(status)) return false;

  return isTodayOrFuture({value: deadline});
};

/** Late is open work whose due date has already gone by. */
export const isChecklistLate = ({
  status,
  deadline,
  dueDate,
}: {
  status?: string;
  deadline?: string | null;
  dueDate?: string | null;
}): boolean => {
  if (!isChecklistOpen({status, deadline})) return false;

  return isBeforeToday({value: dueDate});
};

/** Minutes a checklist should take, at two questions a minute. */
export const getChecklistMinutes = ({
  questionCount,
}: {
  questionCount: number;
}): number => Math.ceil(questionCount / CAREGIVER_QUESTIONS_PER_MINUTE);

/** Flattens one raw submission into the shape every caregiver screen reads. */
export const toCaregiverChecklist = ({
  submission,
}: {
  submission: any;
}): CaregiverChecklist => {
  const status = submission.status;
  const dueDate = submission.dueDate || null;
  const deadline = submission.deadline || null;
  const isSent = CAREGIVER_SENT_STATUSES.includes(status);

  return {
    id: submission.id,
    patientId: submission.patientId || '',
    patientName: getFullName({
      firstName: submission.patient?.firstName,
      lastName: submission.patient?.lastName,
      lastFirst: true,
    }),
    checklistName: submission.checklistTemplate?.title || '',
    status,
    dueDate,
    deadline,
    submittedAt: submission.submittedAt || null,
    questionCount: countTemplateQuestions({
      template: submission.checklistTemplate,
    }),
    assignmentNote: submission.assignment?.notes || '',
    isSent,
    isOpen: isChecklistOpen({status, deadline}),
    isUpcoming:
      status === CHECKLIST_SUBMISSION_STATUS.UPCOMING.value &&
      isTodayOrFuture({value: dueDate}),
    isLate: isChecklistLate({status, deadline, dueDate}),
    isDueToday: isToday({value: dueDate}),
    isSentToday: isSent && isToday({value: submission.submittedAt}),
  };
};

/**
 * Orders two checklists by one of their dates, then by name. The late and
 * upcoming lists read the due date, which is what their labels show; the
 * due-today list reads the deadline, the order she has to work in.
 */
const byDateThenName = ({
  a,
  b,
  field,
}: {
  a: CaregiverChecklist;
  b: CaregiverChecklist;
  field: 'dueDate' | 'deadline';
}): number => {
  const aDate = fromIso({value: a[field]})?.toMillis() ?? 0;
  const bDate = fromIso({value: b[field]})?.toMillis() ?? 0;

  if (aDate !== bDate) return aDate - bDate;

  return a.checklistName.localeCompare(b.checklistName);
};

/** Late checklists, oldest due first. */
export const getLateChecklists = ({
  checklists,
}: {
  checklists: CaregiverChecklist[];
}): CaregiverChecklist[] =>
  checklists
    .filter(({isLate}) => isLate)
    .sort((a, b) => byDateThenName({a, b, field: 'dueDate'}));

/** Today's open checklists, earliest deadline first, then by name. */
export const getDueTodayChecklists = ({
  checklists,
}: {
  checklists: CaregiverChecklist[];
}): CaregiverChecklist[] =>
  checklists
    .filter(({isOpen, isDueToday, isLate}) => isOpen && isDueToday && !isLate)
    .sort((a, b) => byDateThenName({a, b, field: 'deadline'}));

/** What the caregiver sent today, most recent first. */
export const getSentTodayChecklists = ({
  checklists,
}: {
  checklists: CaregiverChecklist[];
}): CaregiverChecklist[] =>
  checklists
    .filter(({isSentToday}) => isSentToday)
    .sort(
      (a, b) =>
        (fromIso({value: b.submittedAt})?.toMillis() ?? 0) -
        (fromIso({value: a.submittedAt})?.toMillis() ?? 0)
    );

/**
 * Checklists due after today, soonest first. UPCOMING ones belong here so the
 * patient page can say "Next Thu"; Today never reads this list.
 */
export const getUpcomingChecklists = ({
  checklists,
}: {
  checklists: CaregiverChecklist[];
}): CaregiverChecklist[] =>
  checklists
    .filter(
      ({isOpen, isUpcoming, isLate, isDueToday, dueDate}) =>
        (isOpen || isUpcoming) &&
        isTodayOrFuture({value: dueDate}) &&
        !isLate &&
        !isDueToday
    )
    .sort((a, b) => byDateThenName({a, b, field: 'dueDate'}));

/** What each patient owes today, keyed by patient id. */
export const groupWorkloadByPatient = ({
  checklists,
}: {
  checklists: CaregiverChecklist[];
}): Record<string, CaregiverPatientWorkload> => {
  const workload: Record<string, CaregiverPatientWorkload> = {};

  checklists.forEach((checklist) => {
    if (!checklist.patientId) return;

    const current = workload[checklist.patientId] || {
      lateCount: 0,
      dueTodayCount: 0,
      firstLateName: '',
      firstDueTodayName: '',
    };

    if (checklist.isLate) {
      current.lateCount += 1;
      current.firstLateName = current.firstLateName || checklist.checklistName;
    } else if (checklist.isOpen && checklist.isDueToday) {
      current.dueTodayCount += 1;
      current.firstDueTodayName =
        current.firstDueTodayName || checklist.checklistName;
    }

    workload[checklist.patientId] = current;
  });

  return workload;
};

/**
 * The one line that says what a patient owes today, for the phone list and
 * the desktop table alike. Late outranks due, and one checklist is named
 * while several are counted.
 */
export const getWorkloadLine = ({
  workload,
  t,
}: {
  workload?: CaregiverPatientWorkload;
  t: TranslateFunction;
}): {text: string; isLate: boolean} => {
  const lateCount = workload?.lateCount || 0;
  const dueTodayCount = workload?.dueTodayCount || 0;

  const args = {interpolation: {escapeValue: false}};

  if (lateCount === 1) {
    return {
      isLate: true,
      text: t('caregiverPortal.patients.lateLine', {
        checklist: workload?.firstLateName,
        ...args,
      }),
    };
  }

  if (lateCount > 1) {
    return {
      isLate: true,
      text: t('caregiverPortal.patients.countLate', {count: lateCount}),
    };
  }

  if (dueTodayCount === 1) {
    return {
      isLate: false,
      text: t('caregiverPortal.patients.dueToday', {
        checklist: workload?.firstDueTodayName,
        ...args,
      }),
    };
  }

  if (dueTodayCount > 1) {
    return {
      isLate: false,
      text: t('caregiverPortal.patients.countDueToday', {
        count: dueTodayCount,
      }),
    };
  }

  return {isLate: false, text: t('caregiverPortal.patients.nothingDue')};
};

/** Which greeting fits the hour: morning, afternoon after 12, evening after 17. */
export const getGreetingKey = ({
  hour,
}: {
  hour: number;
}): 'morning' | 'afternoon' | 'evening' => {
  if (hour >= CAREGIVER_GREETING_HOURS.evening) return 'evening';
  if (hour >= CAREGIVER_GREETING_HOURS.afternoon) return 'afternoon';

  return 'morning';
};

/**
 * "6 questions · about 3 min". Empty when the API did not carry the question
 * count, so the row shows the checklist name alone rather than "0 questions".
 */
export const getQuestionsLine = ({
  questionCount,
  t,
}: {
  questionCount: number;
  t: TranslateFunction;
}): string => {
  if (questionCount <= 0) return '';

  return t('caregiverPortal.checklist.questions', {
    count: questionCount,
    minutes: getChecklistMinutes({questionCount}),
  });
};

/** The day a late checklist was due, as "20 Aug". */
export const getDueDayLabel = ({date}: {date: string | null}): string =>
  date ? formatDate({date, format: CAREGIVER_DATE_FORMATS.dueDay}) : '';

/** The clock time a checklist was sent, as "07:20". */
export const getSentTimeLabel = ({date}: {date: string | null}): string =>
  date ? formatDate({date, format: DATE_FORMATS.time}) : '';

/**
 * Where one checklist stands, in one line: late and since when, sent and at
 * what time, due today, or the day it comes up next. The table's Due column
 * and the phone row both say it this way.
 */
export const getChecklistDueLabel = ({
  checklist,
  t,
}: {
  checklist: CaregiverChecklist;
  t: TranslateFunction;
}): string => {
  if (checklist.isLate)
    return t('caregiverPortal.patient.state.late', {
      date: getDueDayLabel({date: checklist.dueDate}),
    });

  if (checklist.isSent)
    return t('caregiverPortal.patient.state.sent', {
      time: getSentTimeLabel({date: checklist.submittedAt}),
    });

  if (checklist.isDueToday) return t('caregiverPortal.patient.state.dueToday');

  if (!checklist.dueDate) return '';

  return t('caregiverPortal.patient.state.next', {
    date: formatDate({
      date: checklist.dueDate,
      format: CAREGIVER_DATE_FORMATS.nextDay,
    }),
  });
};

/**
 * Where one checklist opens: the runner while she can still send it, the
 * sent submission once she has, and nowhere for work that is not due yet. An
 * upcoming checklist is shown so she can plan, not so she can start it.
 */
export const getChecklistHref = ({
  checklist,
}: {
  checklist: CaregiverChecklist;
}): string => {
  if (checklist.isSent) {
    return DASHBOARD_ROUTES.submissions.single({id: checklist.id});
  }

  if (checklist.isLate || checklist.isDueToday) {
    return DASHBOARD_ROUTES.checklist({id: checklist.id});
  }

  return '';
};
