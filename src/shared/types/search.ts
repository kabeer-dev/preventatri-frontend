import type {SEARCH_RESULT_TYPES} from '@/shared/constants/globalSearch';

export type SearchResultType =
  (typeof SEARCH_RESULT_TYPES)[keyof typeof SEARCH_RESULT_TYPES];
