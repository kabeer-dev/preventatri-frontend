import {LIST_FILTER_KINDS} from '@/shared/constants/listToolbar';

export type ListFilterKind =
  (typeof LIST_FILTER_KINDS)[keyof typeof LIST_FILTER_KINDS];

export type ListFilterDrafts = Record<string, string[]>;

export type ListToolbarTranslate = (
  key: string,
  options?: Record<string, unknown>
) => string;
