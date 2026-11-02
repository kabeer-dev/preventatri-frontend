'use client';

import {useMemo} from 'react';

import {ASSESSMENT_CHECKLIST_STATUS} from '@/shared/constants/assessmentChecklists';
import {DROPDOWN_SORT} from '@/shared/constants/general';
import {
  ASSESSMENTS,
  SUB_ROUTE_PARAMS,
} from '@/shared/constants/reactQueryConstants';
import {useAsyncSelectOptions} from '@/shared/hooks/useAsyncSelectOptions';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {
  WorkItemChecklistOptionsParams,
  WorkItemTemplateOptionSource,
} from '@/shared/interfaces/workItem';

const toTemplateOption = ({row}: {row: WorkItemTemplateOptionSource}) => ({
  label: row.title,
  value: row.id,
});

// Checklist templates of one type, searched and paged on the server. Active
// only unless the caller passes `status: null` to list every status.
export const useWorkItemChecklistOptions = ({
  type,
  status = ASSESSMENT_CHECKLIST_STATUS.ACTIVE.value,
  enabled = true,
  seedTemplate,
}: WorkItemChecklistOptionsParams): AsyncSelectSource => {
  const params = useMemo(
    () => ({
      type,
      ...(status ? {status} : {}),
      ...DROPDOWN_SORT.byTitle,
      ...SUB_ROUTE_PARAMS,
    }),
    [type, status]
  );

  const seedId = seedTemplate?.id;
  const seedTitle = seedTemplate?.title;

  const seedOptions = useMemo(
    () => (seedId && seedTitle ? [{value: seedId, label: seedTitle}] : []),
    [seedId, seedTitle]
  );

  return useAsyncSelectOptions({
    query: ASSESSMENTS.fetchAssessmentTemplatesList,
    listKey: 'templates',
    toOption: toTemplateOption,
    params,
    enabled,
    seedOptions,
  });
};
