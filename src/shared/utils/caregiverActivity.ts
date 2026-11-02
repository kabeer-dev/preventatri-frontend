import {
  CHECKLIST_SUBMISSION_STATUS,
  getSubmissionStatusConfig,
} from '@/shared/constants/assessmentChecklists';
import {CAREGIVER_DATE_FORMATS} from '@/shared/constants/caregiver';
import {DATE_FORMATS} from '@/shared/constants/common';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {
  getRedFlagStatusConfig,
  RED_FLAG_STATUS,
} from '@/shared/constants/redFlag';
import {
  CaregiverActivityDay,
  CaregiverActivityItem,
} from '@/shared/interfaces/caregiverActivity';
import {TranslateFunction} from '@/shared/types/common';
import {formatDate, getDaysUntil, groupByDay} from '@/shared/utils/dateUtils';
import {getFullName} from '@/shared/utils/general';
import {getReasonLabel} from '@/shared/utils/redFlagUtils';

/**
 * "Sent · 2 comments, 1 photo", but only when the list payload carried the
 * answers. It usually does not, and a made-up count is worse than none, so the
 * row falls back to plain "Sent".
 */
const getChecklistDetail = ({
  submission,
  t,
}: {
  submission: any;
  t: TranslateFunction;
}): string => {
  const answers = Array.isArray(submission?.answers) ? submission.answers : [];

  const comments = answers.filter((answer: any) => answer?.comment).length;

  const photos = answers.reduce(
    (total: number, answer: any) =>
      total + (Array.isArray(answer?.images) ? answer.images.length : 0),
    0
  );

  if (!comments && !photos) return t('caregiverActivity.detail.sent');

  return t('caregiverActivity.detail.sentWithCounts', {comments, photos});
};

/** One sent checklist as a feed row. */
export const toChecklistActivity = ({
  submission,
  t,
}: {
  submission: any;
  t: TranslateFunction;
}): CaregiverActivityItem => {
  const patientName = getFullName({
    firstName: submission.patient?.firstName,
    lastName: submission.patient?.lastName,
    lastFirst: true,
  });

  const timestamp = submission.submittedAt || submission.dueDate || '';

  const isReviewed =
    submission.status === CHECKLIST_SUBMISSION_STATUS.REVIEWED.value;

  return {
    id: submission.id,
    kind: 'checklists',
    patientId: submission.patientId || '',
    patientName,
    timestamp,
    timeLabel: timestamp
      ? formatDate({date: timestamp, format: DATE_FORMATS.time})
      : '',
    title: [submission.checklistTemplate?.title, patientName]
      .filter(Boolean)
      .join(' · '),
    detail: getChecklistDetail({submission, t}),
    statusLabel: isReviewed
      ? t('caregiverActivity.status.noFollowUp')
      : t('caregiverActivity.status.reviewing'),
    statusColor: getSubmissionStatusConfig({status: submission.status, t})
      .color,
    href: DASHBOARD_ROUTES.submissions.single({id: submission.id}),
  };
};

/** One red flag as a feed row. */
export const toRedFlagActivity = ({
  redFlag,
  t,
}: {
  redFlag: any;
  t: TranslateFunction;
}): CaregiverActivityItem => {
  const patientName = getFullName({
    firstName: redFlag.patient?.firstName,
    lastName: redFlag.patient?.lastName,
    lastFirst: true,
  });

  const firstLine = (redFlag.description || '').split('\n')[0].trim();

  // Photos and the voice note ride on the flag when the list payload carries
  // them. It often does not, and the row reads fine without them.
  const photos = Array.isArray(redFlag.images) ? redFlag.images.length : 0;
  const hasVoiceNote = Boolean(redFlag.audioNote);

  const attachments = [
    photos ? t('caregiverActivity.detail.photos', {count: photos}) : '',
    hasVoiceNote ? t('caregiverActivity.detail.voiceNote') : '',
  ].filter(Boolean);

  const resolverName = [
    redFlag.resolvedBy?.firstName,
    redFlag.resolvedBy?.lastName,
  ]
    .filter(Boolean)
    .join(' ');

  const status = (redFlag.status || '').toUpperCase();

  const getStatusLabel = () => {
    if (status === RED_FLAG_STATUS.PENDING.value) {
      return t('caregiverActivity.status.open');
    }

    if (status === RED_FLAG_STATUS.ACCEPTED.value) {
      return t('caregiverActivity.status.accepted');
    }

    if (status === RED_FLAG_STATUS.RESOLVED.value) {
      return resolverName
        ? t('caregiverActivity.status.resolvedBy', {name: resolverName})
        : t('caregiverActivity.status.resolved');
    }

    return t('caregiverActivity.status.voided');
  };

  return {
    id: redFlag.id,
    kind: 'redFlags',
    patientId: redFlag.patientId || '',
    patientName,
    timestamp: redFlag.createdAt || '',
    timeLabel: redFlag.createdAt
      ? formatDate({date: redFlag.createdAt, format: DATE_FORMATS.time})
      : '',
    title: [t('caregiverActivity.redFlag'), patientName]
      .filter(Boolean)
      .join(' · '),
    detail: [
      firstLine ? `"${firstLine}"` : getReasonLabel({reason: redFlag.reason}),
      attachments.join(', '),
    ]
      .filter(Boolean)
      .join(' · '),
    statusLabel: getStatusLabel(),
    statusColor: getRedFlagStatusConfig({status, t}).color || 'default',
    href: DASHBOARD_ROUTES.emergencyFlags.single({id: redFlag.id}),
  };
};

/**
 * The merged feed, newest first and cut into days. "Today" and "Yesterday"
 * are named; every earlier day gets its date.
 */
export const groupActivityByDay = ({
  items,
  t,
}: {
  items: CaregiverActivityItem[];
  t: TranslateFunction;
}): CaregiverActivityDay[] =>
  groupByDay({
    items,
    getDate: ({item}) => item.timestamp,
    labelDay: ({date}) => {
      const daysAgo = Math.round(-getDaysUntil({date}));

      if (daysAgo === 0) return t('caregiverActivity.day.today');
      if (daysAgo === 1) return t('caregiverActivity.day.yesterday');

      return formatDate({date, format: CAREGIVER_DATE_FORMATS.headerDay});
    },
  });
