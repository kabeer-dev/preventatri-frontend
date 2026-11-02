'use client';

import {useMemo} from 'react';

import {parseAsString, useQueryStates} from 'nuqs';

import {
  ListToolbarFiltersProps,
  UseListToolbarFiltersParams,
} from '@/shared/interfaces/listToolbar';
import {
  normalizeFilterValues,
  serializeFilterValues,
} from '@/shared/utils/listToolbar';

export const useListToolbarFilters = ({
  fields,
}: UseListToolbarFiltersParams) => {
  const visibleFields = useMemo(
    () => fields.filter((field) => field.visible !== false),
    [fields]
  );

  const urlFields = useMemo(
    () => visibleFields.filter((field) => !field.disabled),
    [visibleFields]
  );

  const parsers = useMemo(
    () =>
      Object.fromEntries(
        urlFields.map((field) => [field.param, parseAsString.withDefault('')])
      ),
    [urlFields]
  );

  const [applied, setApplied] = useQueryStates(parsers, {
    clearOnDefault: true,
  });

  const appliedValues: Record<string, string[]> = useMemo(
    () =>
      Object.fromEntries(
        urlFields.map((field) => [
          field.param,
          normalizeFilterValues({field, value: applied[field.param] ?? ''}),
        ])
      ),
    [urlFields, applied]
  );

  const filterParams: Record<string, string> = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(appliedValues)
          .filter(([, values]) => values.length)
          .map(([param, values]) => [param, serializeFilterValues({values})])
      ),
    [appliedValues]
  );

  const toolbarFilters: ListToolbarFiltersProps = useMemo(
    () => ({
      fields: visibleFields.map((field) => ({
        ...field,
        values: appliedValues[field.param] ?? [],
      })),
      onApply: ({drafts}) =>
        setApplied(
          Object.fromEntries(
            urlFields
              .filter((field) => drafts[field.param])
              .map((field) => [
                field.param,
                serializeFilterValues({values: drafts[field.param]}),
              ])
          )
        ),
      onRemove: ({param}) => setApplied({[param]: ''}),
      onClearAll: () =>
        setApplied(
          Object.fromEntries(urlFields.map((field) => [field.param, '']))
        ),
    }),
    [visibleFields, urlFields, appliedValues, setApplied]
  );

  return {filterParams, toolbarFilters};
};
