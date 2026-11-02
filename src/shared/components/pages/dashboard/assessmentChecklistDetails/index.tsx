'use client';

import {useEffect} from 'react';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {ASSESSMENT_CHECKLIST_STATUS} from '@/shared/constants/assessmentChecklists';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {AssessmentChecklistDetailsProps} from '@/shared/interfaces/assessmentChecklistDetails';
import {assessmentQueries} from '@/shared/reactQuery';
import {transformAssessmentChecklistDetailsResponse} from '@/shared/utils/assessmentChecklistUtils';

import AssessmentChecklistDetailsUI from './AssessmentChecklistDetailsUI';

export default function AssessmentChecklistDetails({
  checklistId,
}: AssessmentChecklistDetailsProps) {
  const {t} = useTranslation();
  const router = useLocaleRouter();
  const {useFetchAssessmentTemplate} = assessmentQueries();

  const {data, isLoading, isError} = useFetchAssessmentTemplate({
    id: checklistId,
    params: {includeUsage: true},
  });

  const rawChecklist = data?.template;

  const isDraft =
    rawChecklist?.status === ASSESSMENT_CHECKLIST_STATUS.DRAFT.value;

  // Drafts are still being built, so they belong in the builder.
  useEffect(() => {
    if (isDraft)
      router.replace({
        url: DASHBOARD_ROUTES.assessmentChecklists.builder({id: checklistId}),
      });
  }, [isDraft, checklistId, router]);

  if (isLoading || isDraft)
    return <PageSkeleton {...PAGE_SKELETONS.assessmentChecklistDetails} />;

  if (!rawChecklist || isError) {
    return (
      <ContentNotAvailable
        title={t('assessmentChecklists.notFoundTitle')}
        message={t('assessmentChecklists.notFoundMessage')}
      />
    );
  }

  const checklist = transformAssessmentChecklistDetailsResponse({
    checklist: rawChecklist,
  });

  return (
    <AssessmentChecklistDetailsUI
      checklist={checklist}
      usage={data?.usage ?? null}
    />
  );
}
