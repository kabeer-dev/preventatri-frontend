import {
  LIST_FILTER_KINDS,
  LIST_FILTER_VALUE_SEPARATOR,
  LIST_TOOLBAR,
} from '@/shared/constants/listToolbar';
import {
  FilterFieldTextParams,
  ListFilterFieldConfig,
  ListToolbarFilterField,
  UnsupportedFilterConfig,
} from '@/shared/interfaces/listToolbar';
import {ListToolbarTranslate} from '@/shared/types/listToolbar';

export const parseFilterValues = ({value}: {value: string}): string[] =>
  value ? value.split(LIST_FILTER_VALUE_SEPARATOR).filter(Boolean) : [];

export const serializeFilterValues = ({values}: {values: string[]}): string =>
  values.join(LIST_FILTER_VALUE_SEPARATOR);

// URLs can be hand edited, so drop repeats, values outside a fixed option list,
// and extra values on a single choice field before they reach the API.
// Searchable fields load a capped page of options, so their ids are kept as is.
export const normalizeFilterValues = ({
  field,
  value,
}: {
  field: ListFilterFieldConfig;
  value: string;
}): string[] => {
  const unique = [...new Set(parseFilterValues({value}))];

  const known = field.searchable
    ? unique
    : unique.filter((item) =>
        field.options.some((option) => option.value === item)
      );

  return field.kind === LIST_FILTER_KINDS.single ? known.slice(0, 1) : known;
};

export const formatFilterValues = ({
  field,
  t,
}: FilterFieldTextParams): string => {
  const labels = field.values.map(
    (value) =>
      field.options.find((option) => option.value === value)?.label ||
      field.knownLabels?.[value] ||
      ''
  );

  if (labels.some((label) => !label))
    return t('listToolbar.selectedCount', {count: field.values.length});

  if (labels.length <= LIST_TOOLBAR.chipValuesShown) return labels.join(', ');

  return t('listToolbar.moreValues', {
    first: labels[0],
    count: labels.length - 1,
    interpolation: {escapeValue: false},
  });
};

export const getFilterQualifierKey = ({
  field,
}: {
  field: ListToolbarFilterField;
}): string => {
  if (field.disabled) return 'listToolbar.needsApi';
  if (field.kind === LIST_FILTER_KINDS.multi) return 'listToolbar.anyOf';

  return 'listToolbar.oneOf';
};

export const getFilterFlagLabel = ({
  field,
  t,
}: FilterFieldTextParams): string => {
  if (field.disabled) return t('listToolbar.soon');
  if (field.values.length) return String(field.values.length);

  return '';
};

export const getInitialFilterParam = ({
  fields,
}: {
  fields: ListToolbarFilterField[];
}): string => {
  const initialField =
    fields.find((field) => field.values.length) ??
    fields.find((field) => !field.disabled) ??
    fields[0];

  return initialField?.param ?? '';
};

export const buildTabParams = ({
  param,
  value,
}: {
  param: string;
  value: string;
}): Record<string, string> => ({[param]: value});

export const buildUnsupportedFilterFields = ({
  fields,
  t,
}: {
  fields: UnsupportedFilterConfig[];
  t: ListToolbarTranslate;
}): ListFilterFieldConfig[] =>
  fields.map(({param, labelKey, icon}) => ({
    param,
    label: t(labelKey),
    icon,
    kind: LIST_FILTER_KINDS.multi,
    options: [],
    disabled: true,
  }));
