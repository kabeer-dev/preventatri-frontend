'use client';

import {useMemo} from 'react';

import {useListToolbarFilters} from './useListToolbarFilters';
import {useRegionFilterField} from './useRegionFilterField';

// Severity is not a filter here: the alert tabs own it.
export const useTriageAlertFilters = () => {
  const regionField = useRegionFilterField();

  const fields = useMemo(() => [regionField], [regionField]);

  return useListToolbarFilters({fields});
};
