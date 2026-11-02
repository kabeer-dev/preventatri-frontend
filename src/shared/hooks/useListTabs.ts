'use client';

import {useMemo} from 'react';

import {parseAsStringLiteral, useQueryState} from 'nuqs';

import {SegmentedTabsProps} from '@/shared/interfaces/inputs';
import {UseListTabsParams} from '@/shared/interfaces/listToolbar';

import useTranslation from './useTranslation';

export const useListTabs = ({
  urlKey,
  ariaLabel,
  options,
  defaultValue,
}: UseListTabsParams) => {
  const {t} = useTranslation();

  const selectableValues = useMemo(
    () => options.filter((option) => !option.disabled).map(({value}) => value),
    [options]
  );

  const [value, setValue] = useQueryState(
    urlKey,
    parseAsStringLiteral(selectableValues)
      .withDefault(defaultValue)
      .withOptions({clearOnDefault: true})
  );

  const tabParams = useMemo(
    () => options.find((option) => option.value === value)?.params ?? {},
    [options, value]
  );

  const tabs: SegmentedTabsProps = {
    value,
    ariaLabel,
    options: options.map((option) => ({
      value: option.value,
      label: t(option.labelKey),
      disabled: option.disabled,
      disabledReason: option.disabled
        ? t('listToolbar.tabNeedsApi')
        : undefined,
    })),
    onChange: ({value: next}) => setValue(next),
  };

  return {tabs, tabParams};
};
