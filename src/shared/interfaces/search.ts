import {KeyboardEvent, RefObject} from 'react';

import {SearchResultType} from '@/shared/types/search';

/** One row of GET /search: patients carry a location, staff an email. */
export interface GlobalSearchRow {
  id: string;
  type: SearchResultType;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  location: string | null;
}

export interface GlobalSearchResponse {
  results: GlobalSearchRow[];
}

export interface GlobalSearchParams {
  search: string;
  limit: number;
}

export interface SearchResult {
  id: string;
  type: SearchResultType;
  name: string;
  subtitle: string;
}

export interface SearchResultItemProps {
  result: SearchResult;
  onClick: () => void;
}

export interface UseGlobalSearchParams {
  term: string;
}

export interface UseGlobalSearchResult {
  results: SearchResult[];
  isFetching: boolean;
  debouncedTerm: string;
}

export interface MapSearchRowParams {
  row: GlobalSearchRow;
  t: (key: string) => string;
}

export interface UseDebouncedSearchTermResult {
  debouncedTerm: string;
  enabled: boolean;
}

export interface SearchFieldProps {
  term: string;
  onTermChange: (args: {term: string}) => void;
  results: SearchResult[];
  isFetching: boolean;
  debouncedTerm: string;
  placeholder: string;
  ariaLabel: string;
}

/** The fields patient search reads from one GET /patients row. */
export interface PatientSearchRow {
  id: string;
  firstName: string | null;
  lastName: string | null;
  county: {id: string; name: string} | null;
}

export interface PatientSearchResponse {
  patients: PatientSearchRow[];
}

export interface SearchResultsPanelProps {
  anchorEl: HTMLDivElement | null;
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  isFetching: boolean;
  listRef: RefObject<HTMLUListElement | null>;
  onListKeyDown: (event: KeyboardEvent<HTMLUListElement>) => void;
  onResultClick: () => void;
}
