'use client';

import {useEffect} from 'react';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import GlobalLoader from '@/shared/components/common/loaders/GlobalLoader';
import {ASSESSMENT_CHECKLIST_STATUS} from '@/shared/constants/assessmentChecklists';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import {useChecklistBuilder} from '@/shared/hooks/checklistBuilder/useChecklistBuilder';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  ChecklistBuilderFormProps,
  ChecklistBuilderProps,
} from '@/shared/interfaces/checklistBuilder';
import {assessmentQueries} from '@/shared/reactQuery';

import ChecklistBuilderUI from './ChecklistBuilderUI';

const ChecklistBuilderForm = ({template}: ChecklistBuilderFormProps) => {
  const builder = useChecklistBuilder({template});

  return <ChecklistBuilderUI template={template} builder={builder} />;
};

const ChecklistBuilder = ({checklistId}: ChecklistBuilderProps) => {
  const {t} = useTranslation();
  const router = useLocaleRouter();
  const {useFetchAssessmentTemplate} = assessmentQueries();

  const {data, isLoading, isError} = useFetchAssessmentTemplate({
    id: checklistId,
    params: {...SUB_ROUTE_PARAMS},
  });

  const template = data?.template;

  const isPublished =
    Boolean(template) &&
    template?.status !== ASSESSMENT_CHECKLIST_STATUS.DRAFT.value;

  // Published checklists are read-only, so the builder hands over to the detail page.
  useEffect(() => {
    if (isPublished)
      router.replace({
        url: DASHBOARD_ROUTES.assessmentChecklists.single({id: checklistId}),
      });
  }, [isPublished, checklistId, router]);

  if (isLoading || isPublished) return <GlobalLoader className='h-full' />;

  if (!template || isError) {
    return (
      <ContentNotAvailable
        title={t('assessmentChecklists.notFoundTitle')}
        message={t('assessmentChecklists.notFoundMessage')}
      />
    );
  }

  return <ChecklistBuilderForm template={template} />;
};

export default ChecklistBuilder;
