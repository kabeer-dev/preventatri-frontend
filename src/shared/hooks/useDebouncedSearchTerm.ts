import {
  GLOBAL_SEARCH_DEBOUNCE_MS,
  GLOBAL_SEARCH_MIN_CHARS,
} from '@/shared/constants/globalSearch';
import useDebounce from '@/shared/hooks/useDebounce';
import {
  UseDebouncedSearchTermResult,
  UseGlobalSearchParams,
} from '@/shared/interfaces/search';

// The top-bar searches only fire once the trimmed term settles and is long enough.
const useDebouncedSearchTerm = ({
  term,
}: UseGlobalSearchParams): UseDebouncedSearchTermResult => {
  const debouncedTerm = useDebounce({
    value: term.trim(),
    delay: GLOBAL_SEARCH_DEBOUNCE_MS,
  });

  return {
    debouncedTerm,
    enabled: debouncedTerm.length >= GLOBAL_SEARCH_MIN_CHARS,
  };
};

export default useDebouncedSearchTerm;
