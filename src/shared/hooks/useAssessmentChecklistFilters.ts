'use client';

import {useMemo} from 'react';

import {CHECKLIST_TEMPLATE_TYPES} from '@/shared/constants/assessmentChecklists';
import {FILTER_PARAMS} from '@/shared/constants/general';
import {
  LIST_FILTER_ICONS,
  LIST_FILTER_KINDS,
} from '@/shared/constants/listToolbar';
import {ListFilterFieldConfig} from '@/shared/interfaces/listToolbar';

import {useListToolbarFilters} from './useListToolbarFilters';
import useTranslation from './useTranslation';

export const useAssessmentChecklistFilters = () => {
  const {t} = useTranslation();

  const fields: ListFilterFieldConfig[] = useMemo(
    () => [
      {
        param: FILTER_PARAMS.checklistType,
        label: t('filters.checklistType'),
        icon: LIST_FILTER_ICONS.checklistType,
        kind: LIST_FILTER_KINDS.single,
        options: Object.values(CHECKLIST_TEMPLATE_TYPES).map((type) => ({
          value: type.value,
          label: t(type.labelKey),
        })),
      },
    ],
    [t]
  );

  return useListToolbarFilters({fields});
};
