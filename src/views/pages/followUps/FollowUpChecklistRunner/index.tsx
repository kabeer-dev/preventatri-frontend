'use client';

import {useMemo} from 'react';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {FOLLOW_UP_TASK_OPEN_STATUSES} from '@/shared/constants/followUps';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  FollowUpDetail,
  FollowUpDetailsProps,
} from '@/shared/interfaces/followUp';
import {followUpTaskQueries} from '@/shared/reactQuery';
import {
  flattenRunnerQuestions,
  seedAnswersFromSubmission,
} from '@/views/pages/caregiverChecklist/utils';
import {mapChecklistSections} from '@/views/pages/checklist/types';

import FollowUpChecklistRunnerView from './FollowUpChecklistRunnerView';

// Loads the task and hands its checklist to the runner. Only the assignee of
// an open task gets the questions; anyone else is sent back to the task.
const FollowUpChecklistRunner = ({id}: FollowUpDetailsProps) => {
  const {t} = useTranslation();
  const {currentUser} = useGetLoggedInUser();

  const {useFetchFollowUpTask} = followUpTaskQueries();
  const {data, isLoading, isError} = useFetchFollowUpTask({id});

  const task: FollowUpDetail | undefined = data?.task;
  const template = task?.checklistTemplate;

  const sections = useMemo(
    () => mapChecklistSections({sections: template?.sections}),
    [template]
  );

  const questions = useMemo(
    () => flattenRunnerQuestions({sections}),
    [sections]
  );

  // A reopened task starts from what was answered before.
  const seededAnswers = useMemo(
    () =>
      seedAnswersFromSubmission({
        questions,
        submissionAnswers: Array.isArray(task?.answers) ? task.answers : [],
      }),
    [questions, task]
  );

  if (isLoading) return <PageSkeleton {...PAGE_SKELETONS.checklistRunner} />;

  if (isError || !task) {
    return (
      <ContentNotAvailable
        title={t('followUps.detail.notFoundTitle')}
        message={t('followUps.detail.notFoundMessage')}
      />
    );
  }

  const canAnswer =
    FOLLOW_UP_TASK_OPEN_STATUSES.includes(task.status) &&
    task.assignee?.user?.id === currentUser?.id &&
    questions.length > 0;

  if (!canAnswer) {
    return (
      <ContentNotAvailable
        title={t('followUps.detail.runnerUnavailableTitle')}
        message={t('followUps.detail.runnerUnavailableMessage')}
      />
    );
  }

  return (
    <FollowUpChecklistRunnerView
      task={task}
      questions={questions}
      seededAnswers={seededAnswers}
    />
  );
};

export default FollowUpChecklistRunner;
