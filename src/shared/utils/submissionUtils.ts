import {
  CHECKLIST_SUBMISSION_STATUS,
  SKIPPABLE_STATUSES,
  SUBMISSION_DAY_FORMAT,
  SUBMISSION_FOLLOW_UP_STATUSES,
  SUBMISSION_GUIDANCE_KEYS,
  SUBMISSION_SCHEDULE_LABEL_KEYS,
  VOIDABLE_STATUSES,
} from '@/shared/constants/assessmentChecklists';
import {DATE_ONLY_ZONE} from '@/shared/constants/common';
import {MINUTES_PER_DAY} from '@/shared/constants/followUps';
import {
  Submission,
  SubmissionPermissions,
  SubmissionPersonName,
  SubmissionResponse,
  SubmissionTiming,
} from '@/shared/interfaces/submission';
import {TranslateFunction} from '@/shared/types/common';
import {formatDate} from '@/shared/utils/dateUtils';
import {getFullName} from '@/shared/utils/general';
import {formatDurationLabel} from '@/shared/utils/workItemUtils';

const getName = ({person}: {person: SubmissionPersonName | null}) =>
  getFullName({firstName: person?.firstName, lastName: person?.lastName});

export const transformSubmissionResponse = ({
  submission,
}: {
  submission: SubmissionResponse;
}): Submission => ({
  id: submission.id,
  patientId: submission.patientId,
  checklistName: submission.checklistTemplate?.title || '',
  patientName: getName({person: submission.patient}),
  caregiverName: getName({person: submission.assignee}),
  scheduleType: submission.assignment?.type || null,
  assignedByName: getName({person: submission.assignment?.assigner ?? null}),
  riskFlag: submission.risk?.flag || null,
  submittedAt: submission.submittedAt || '',
  status: submission.status || CHECKLIST_SUBMISSION_STATUS.SUBMITTED.value,
  dueDate: submission.dueDate,
  deadline: submission.deadline,
  lateDays: submission.lateDays,
  skipReason: submission.skipReason,
  voidedAt: submission.voidedAt || null,
});

// Due dates and deadlines are calendar days, so they never shift with the zone.
export const formatSubmissionDay = ({date}: {date: string | null}) =>
  date
    ? formatDate({date, format: SUBMISSION_DAY_FORMAT, zone: DATE_ONLY_ZONE})
    : '';

export const getSubmissionScheduleLabel = ({
  type,
  t,
}: {
  type: string | null;
  t: TranslateFunction;
}) =>
  type && SUBMISSION_SCHEDULE_LABEL_KEYS[type]
    ? t(SUBMISSION_SCHEDULE_LABEL_KEYS[type])
    : '';

// "2 days late"; empty when on time.
export const getSubmissionLateLabel = ({
  lateDays,
  t,
}: {
  lateDays: number | null;
  t: TranslateFunction;
}) =>
  lateDays
    ? t('followUps.due.late', {
        duration: formatDurationLabel({minutes: lateDays * MINUTES_PER_DAY, t}),
      })
    : '';

// Why a submission did not arrive: the grace deadline passed, or staff skipped it.
export const getSubmissionMissReason = ({
  submission,
  t,
}: {
  submission: SubmissionTiming;
  t: TranslateFunction;
}) => {
  if (submission.status === CHECKLIST_SUBMISSION_STATUS.MISSED.value)
    return t('submissions.missReason.graceExpired', {
      deadline: formatSubmissionDay({date: submission.deadline}),
    });

  if (submission.status === CHECKLIST_SUBMISSION_STATUS.SKIPPED.value)
    return submission.skipReason
      ? t('submissions.missReason.skipped', {reason: submission.skipReason})
      : t('submissions.missReason.skippedNoReason');

  return '';
};

export const getSubmissionGuidance = ({
  submission,
  t,
}: {
  submission: SubmissionTiming;
  t: TranslateFunction;
}) => {
  const key = SUBMISSION_GUIDANCE_KEYS[submission.status];

  return key
    ? t(key, {
        due: formatSubmissionDay({date: submission.dueDate}),
        deadline: formatSubmissionDay({date: submission.deadline}),
      })
    : '';
};

// Skip and void mirror the backend's admin-only void permission; follow-up
// tasks are open to every staff role.
export const getSubmissionPermissions = ({
  status,
  isAdmin,
  isStaff,
}: {
  status: string;
  isAdmin: boolean;
  isStaff: boolean;
}): SubmissionPermissions => ({
  canSkip:
    isAdmin && (SKIPPABLE_STATUSES as readonly string[]).includes(status),
  canVoid: isAdmin && (VOIDABLE_STATUSES as readonly string[]).includes(status),
  canCreateFollowUp:
    isStaff &&
    (SUBMISSION_FOLLOW_UP_STATUSES as readonly string[]).includes(status),
});
