'use client';

import {useCallback, useMemo, useState} from 'react';

import {DROPDOWN_SEARCH_DEBOUNCE_MS} from '@/shared/constants/general';
import {useInfiniteListQueryHandler} from '@/shared/hooks/reactQuery/useInfiniteListQueryHandler';
import useDebounce from '@/shared/hooks/useDebounce';
import {
  AsyncSelectSource,
  UseAsyncSelectOptionsParams,
} from '@/shared/interfaces/asyncSelect';
import {SelectOption} from '@/shared/interfaces/inputs';

const NO_SEED_OPTIONS: never[] = [];

// Each field owns its term, so two open dropdowns never share results.
export const useAsyncSelectOptions = <
  TRow,
  TOption extends SelectOption = SelectOption,
>({
  query,
  listKey,
  toOption,
  params,
  enabled = true,
  seedOptions = NO_SEED_OPTIONS,
}: UseAsyncSelectOptionsParams<TRow, TOption>): AsyncSelectSource<TOption> => {
  const [term, setTerm] = useState('');

  // Picks made from an earlier search, so their labels outlive it.
  const [remembered, setRemembered] = useState<TOption[]>([]);

  const debouncedTerm = useDebounce({
    value: term,
    delay: DROPDOWN_SEARCH_DEBOUNCE_MS,
  });

  const {rows, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage} =
    useInfiniteListQueryHandler<TRow>({
      queryKey: query.queryKey,
      buildEndpoint: query.endpoint,
      listKey,
      params: {...params, ...(debouncedTerm ? {search: debouncedTerm} : {})},
      enabled,
    });

  // A row inserted between two page fetches shifts the next page by one;
  // keying by value keeps the repeat out of the list.
  const options = useMemo(
    () => [
      ...new Map(
        rows.map((row) => {
          const option = toOption({row});

          return [option.value, option] as const;
        })
      ).values(),
    ],
    [rows, toOption]
  );

  const lookup = useMemo(
    () =>
      new Map(
        [...seedOptions, ...remembered, ...options].map((option) => [
          option.value,
          option,
        ])
      ),
    [seedOptions, remembered, options]
  );

  const findOption = useCallback(
    ({value}: {value: string}) => lookup.get(value),
    [lookup]
  );

  const rememberOptions = useCallback(
    ({options: picked}: {options: TOption[]}) => {
      if (picked.length) setRemembered((previous) => [...previous, ...picked]);
    },
    []
  );

  const onSearchChange = useCallback(
    ({term: nextTerm}: {term: string}) => setTerm(nextTerm),
    []
  );

  return useMemo(
    () => ({
      options,
      isLoading: enabled && isLoading,
      isLoadingMore: isFetchingNextPage,
      hasMore: hasNextPage,
      onSearchChange,
      onLoadMore: fetchNextPage,
      findOption,
      rememberOptions,
    }),
    [
      options,
      enabled,
      isLoading,
      isFetchingNextPage,
      hasNextPage,
      onSearchChange,
      fetchNextPage,
      findOption,
      rememberOptions,
    ]
  );
};
