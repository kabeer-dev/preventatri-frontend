'use client';

import DetailFactsCard from '@/shared/components/common/DetailFactsCard';
import useTranslation from '@/shared/hooks/useTranslation';
import {SubmissionScheduleCardProps} from '@/shared/interfaces/submission';
import {getFullName} from '@/shared/utils/general';
import {
  formatSubmissionDay,
  getSubmissionLateLabel,
  getSubmissionMissReason,
  getSubmissionScheduleLabel,
} from '@/shared/utils/submissionUtils';

// Where the submission came from and when it was due.
const SubmissionScheduleCard = ({submission}: SubmissionScheduleCardProps) => {
  const {t} = useTranslation();
  const assigner = submission.assignment?.assigner;

  const facts = [
    {
      label: t('submissions.detail.schedule'),
      value: getSubmissionScheduleLabel({
        type: submission.assignment?.type ?? null,
        t,
      }),
    },
    {
      label: t('submissions.detail.scheduledBy'),
      value: getFullName({
        firstName: assigner?.firstName,
        lastName: assigner?.lastName,
      }),
    },
    {
      label: t('submissions.detail.assignedTo'),
      value: getFullName({
        firstName: submission.assignee?.firstName,
        lastName: submission.assignee?.lastName,
      }),
    },
    {
      label: t('submissions.detail.dueDate'),
      value: formatSubmissionDay({date: submission.dueDate}),
    },
    {
      label: t('submissions.detail.window'),
      value: formatSubmissionDay({date: submission.deadline}),
    },
    {
      label: t('submissions.detail.lateness'),
      value: getSubmissionLateLabel({lateDays: submission.lateDays, t}),
    },
    {
      label: t('submissions.detail.missReason'),
      value: getSubmissionMissReason({submission, t}),
      wide: true,
    },
  ].filter((fact) => Boolean(fact.value));

  if (!facts.length) return null;

  return (
    <DetailFactsCard
      title={t('submissions.detail.scheduleAndDue')}
      facts={facts}
      inline
    />
  );
};

export default SubmissionScheduleCard;
