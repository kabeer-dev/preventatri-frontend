import {SxProps, Theme} from '@mui/material/styles';
import {TextFieldProps} from '@mui/material/TextField';

import {UseAsyncSelectOptionsParams} from '@/shared/interfaces/asyncSelect';
import {SegmentedTabsProps} from '@/shared/interfaces/inputs';
import {
  ListFilterDrafts,
  ListFilterKind,
  ListToolbarTranslate,
} from '@/shared/types/listToolbar';

export interface ListFilterOption {
  value: string;
  label: string;
}

export interface ListToolbarFilterField {
  param: string;
  label: string;
  icon: string;
  kind: ListFilterKind;
  options: ListFilterOption[];
  values: string[];
  searchable?: boolean;
  disabled?: boolean;
  onQueryChange?: ({term}: {term: string}) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;

  knownLabels?: Record<string, string>;
}

export interface ListFilterFieldConfig extends Omit<
  ListToolbarFilterField,
  'values'
> {
  visible?: boolean;
}

export interface UnsupportedFilterConfig {
  param: string;
  labelKey: string;
  icon: string;
}

export interface ListToolbarFiltersProps {
  fields: ListToolbarFilterField[];
  onApply: ({drafts}: {drafts: ListFilterDrafts}) => void;
  onRemove: ({param}: {param: string}) => void;
  onClearAll: () => void;
}

export interface ListToolbarSearchProps {
  value: string;
  onChange: ({val}: {val: string}) => void;
  placeholder: string;
}

export interface ListSearchFieldProps extends ListToolbarSearchProps {
  sx?: SxProps<Theme>;

  /** The top bar renders the same field smaller and narrower. */
  size?: TextFieldProps['size'];
}

export interface ListToolbarProps {
  tabs?: SegmentedTabsProps;
  search?: ListToolbarSearchProps;
  filters?: ListToolbarFiltersProps;
}

export interface ListTabConfig {
  value: string;
  labelKey: string;
  params?: Record<string, string>;
  disabled?: boolean;
}

export interface UseListTabsParams {
  urlKey: string;
  ariaLabel: string;
  options: ListTabConfig[];
  defaultValue: string;
}

export interface UseListToolbarFiltersParams {
  fields: ListFilterFieldConfig[];
}

export interface UseAllOnlyTabsParams {
  ariaLabel: string;
}

export interface FilterEntityOptionsParams {
  enabled?: boolean;
}

// `userId` is what the visits and reports APIs match on; the patients list
// matches the nurse profile.
export interface NurseFilterOptionsParams extends FilterEntityOptionsParams {
  valueField?: 'userId' | 'profileId';
}

export interface RegionFilterOptionsParams extends FilterEntityOptionsParams {
  activeOnly?: boolean;
}

export interface EntityFilterOptionsParams<TRow> extends Omit<
  UseAsyncSelectOptionsParams<TRow, ListFilterOption>,
  'seedOptions'
> {
  cacheKey: string;
}

export interface FilterCaseManagerSource {
  profileId: string;
  caseManagerId: string;
  user?: {firstName?: string; lastName?: string; email?: string};
}

export interface UseCaseManagerOptionsParams {
  enabled: boolean;
  valueField?: 'profileId' | 'caseManagerId';
}

export interface TaskFlagTypeEntry {
  value: number;
  code: string;
}

export interface UseTaskListFiltersParams {
  flagTypeConstant?: Record<number, TaskFlagTypeEntry>;
  i18nNamespace?: string;
  unsupportedFields?: UnsupportedFilterConfig[];
  includeCaseManager?: boolean;
  extraFields?: ListFilterFieldConfig[];
}

export interface FilterFieldTextParams {
  field: ListToolbarFilterField;
  t: ListToolbarTranslate;
}

export interface AddFilterFieldListProps {
  fields: ListToolbarFilterField[];
  activeParam: string;
  onSelect: ({param}: {param: string}) => void;
}

export interface AddFilterOptionListProps {
  field: ListToolbarFilterField;
  query: string;
  draft: string[];
  onDraftChange: ({values}: {values: string[]}) => void;
}

export interface AddFilterValuesProps {
  field: ListToolbarFilterField;
  draft: string[];
  onDraftChange: ({values}: {values: string[]}) => void;
  onReset: () => void;
  onApply: () => void;
}

export interface FilterPatientSource {
  id: string;
  firstName?: string;
  lastName?: string;
}

export interface FilterCaregiverSource {
  caregiverId: string;
  user?: {firstName?: string; lastName?: string};
}

export interface SearchableFilterOptions {
  options: ListFilterOption[];
  knownLabels: Record<string, string>;
  onQueryChange: ({term}: {term: string}) => void;
  onLoadMore: () => void;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
}
