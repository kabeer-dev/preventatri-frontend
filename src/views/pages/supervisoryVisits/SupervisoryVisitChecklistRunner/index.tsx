'use client';

import {useMemo} from 'react';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import GlobalLoader from '@/shared/components/common/loaders/GlobalLoader';
import {SUPERVISORY_VISIT_OPEN_STATUSES} from '@/shared/constants/supervisoryVisits';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  SupervisoryVisitDetail,
  SupervisoryVisitDetailsProps,
} from '@/shared/interfaces/supervisoryVisit';
import {supervisoryVisitQueries} from '@/shared/reactQuery';
import {
  flattenRunnerQuestions,
  seedAnswersFromSubmission,
} from '@/views/pages/caregiverChecklist/utils';
import {mapChecklistSections} from '@/views/pages/checklist/types';

import SupervisoryVisitChecklistRunnerView from './SupervisoryVisitChecklistRunnerView';

// Loads the visit and hands its checklist to the runner. Only the assignee of
// an open visit gets the questions; anyone else is sent back to the visit.
const SupervisoryVisitChecklistRunner = ({
  id,
}: SupervisoryVisitDetailsProps) => {
  const {t} = useTranslation();
  const {currentUser} = useGetLoggedInUser();

  const {useFetchSupervisoryVisit} = supervisoryVisitQueries();
  const {data, isLoading, isError} = useFetchSupervisoryVisit({id});

  const visit: SupervisoryVisitDetail | undefined = data?.visit;
  const template = visit?.checklistTemplate;

  const sections = useMemo(
    () => mapChecklistSections({sections: template?.sections}),
    [template]
  );

  const questions = useMemo(
    () => flattenRunnerQuestions({sections}),
    [sections]
  );

  // A visit sent back for correction (or reopened) starts from what was
  // answered before.
  const seededAnswers = useMemo(
    () =>
      seedAnswersFromSubmission({
        questions,
        submissionAnswers: Array.isArray(visit?.answers) ? visit.answers : [],
      }),
    [questions, visit]
  );

  if (isLoading) return <GlobalLoader className='h-full' />;

  if (isError || !visit) {
    return (
      <ContentNotAvailable
        title={t('supervisoryVisits.detail.notFoundTitle')}
        message={t('supervisoryVisits.detail.notFoundMessage')}
      />
    );
  }

  const canAnswer =
    SUPERVISORY_VISIT_OPEN_STATUSES.includes(visit.status) &&
    visit.assignee?.user?.id === currentUser?.id &&
    questions.length > 0;

  if (!canAnswer) {
    return (
      <ContentNotAvailable
        title={t('supervisoryVisits.detail.runnerUnavailableTitle')}
        message={t('supervisoryVisits.detail.runnerUnavailableMessage')}
      />
    );
  }

  return (
    <SupervisoryVisitChecklistRunnerView
      visit={visit}
      questions={questions}
      seededAnswers={seededAnswers}
    />
  );
};

export default SupervisoryVisitChecklistRunner;
