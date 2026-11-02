'use client';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import useTranslation from '@/shared/hooks/useTranslation';
import {assessmentQueries} from '@/shared/reactQuery';

import SubmissionDetailsUI from './SubmissionDetailsUI';

interface SubmissionDetailsProps {
  submissionId: string;
}

const SubmissionDetails = ({submissionId}: SubmissionDetailsProps) => {
  const {t} = useTranslation();
  const {useFetchSubmission} = assessmentQueries();

  const {data, isLoading, isError} = useFetchSubmission({id: submissionId});

  if (isLoading) return <PageSkeleton {...PAGE_SKELETONS.submissionReview} />;

  const submission = data?.submission;

  if (!submission || isError) {
    return (
      <ContentNotAvailable
        title={t('submissions.notFoundTitle')}
        message={t('submissions.notFoundMessage')}
      />
    );
  }

  return <SubmissionDetailsUI submission={submission} />;
};

export default SubmissionDetails;
