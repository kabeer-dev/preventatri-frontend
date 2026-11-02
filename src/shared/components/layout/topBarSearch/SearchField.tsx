'use client';

import {KeyboardEvent, useEffect, useRef, useState} from 'react';

import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import SearchIcon from '@/shared/assets/icons/search.svg';
import {
  GLOBAL_SEARCH_MIN_CHARS,
  SEARCH_RESULTS_ID,
  TOP_BAR_SEARCH_WIDTH,
} from '@/shared/constants/globalSearch';
import {SearchFieldProps} from '@/shared/interfaces/search';

import SearchResultsPanel from './SearchResultsPanel';
import {topBarSearchFieldSx} from './styles';

const focusFirstResult = ({list}: {list: HTMLUListElement | null}) =>
  list?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();

// Top-bar search input and results dropdown. The caller owns the term and
// supplies results, so any search source (global, patients) can use it.
const SearchField = ({
  term,
  onTermChange,
  results,
  isFetching,
  debouncedTerm,
  placeholder,
  ariaLabel,
}: SearchFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [fieldEl, setFieldEl] = useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Enter can open the panel before it mounts, so the focus waits for the rendered results.
  const isFocusQueuedRef = useRef(false);

  const query = term.trim();
  const isSearchable = query.length >= GLOBAL_SEARCH_MIN_CHARS;
  const isPanelOpen = isOpen && isSearchable;

  // Covers the debounce gap so the panel never flashes "no results" before a request starts.
  const isPending = isFetching || query !== debouncedTerm;

  useEffect(() => {
    if (!isFocusQueuedRef.current || !isPanelOpen || isPending) return;

    isFocusQueuedRef.current = false;
    focusFirstResult({list: listRef.current});
  }, [isPanelOpen, isPending, results]);

  // A queued focus left behind would steal focus the next time the panel opens.
  const handleClose = () => {
    isFocusQueuedRef.current = false;
    setIsOpen(false);
  };

  const handleResultClick = () => {
    handleClose();
    onTermChange({term: ''});
  };

  const handleFieldKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleClose();

      return;
    }

    if (event.key === 'ArrowDown' && isPanelOpen) {
      event.preventDefault();
      focusFirstResult({list: listRef.current});

      return;
    }

    if (event.key !== 'Enter' || !isSearchable) return;

    event.preventDefault();

    // Already settled, so the effect would not run again for this Enter.
    if (isPanelOpen && !isPending) {
      focusFirstResult({list: listRef.current});

      return;
    }

    isFocusQueuedRef.current = true;
    setIsOpen(true);
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== 'Escape' && event.key !== 'Tab') return;

    handleClose();

    if (event.key === 'Escape') inputRef.current?.focus();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box
        sx={{
          position: 'relative',
          flex: {xs: '1 1 auto', sm: 'none'},
          width: {sm: TOP_BAR_SEARCH_WIDTH},
          minWidth: 0,
        }}
      >
        <TextField
          size='small'
          fullWidth
          ref={setFieldEl}
          inputRef={inputRef}
          value={term}
          onChange={(event) => {
            isFocusQueuedRef.current = false;
            onTermChange({term: event.target.value});
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleFieldKeyDown}
          placeholder={placeholder}
          sx={topBarSearchFieldSx}
          slotProps={{
            htmlInput: {
              'aria-label': ariaLabel,
              'aria-haspopup': true,
              'aria-expanded': isPanelOpen,
              'aria-controls': isPanelOpen ? SEARCH_RESULTS_ID : undefined,
            },
            input: {
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <SearchResultsPanel
          anchorEl={fieldEl}
          isOpen={isPanelOpen}
          query={query}
          results={results}
          isFetching={isPending}
          listRef={listRef}
          onListKeyDown={handleListKeyDown}
          onResultClick={handleResultClick}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default SearchField;
