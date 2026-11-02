'use client';

import {UIEvent, useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  DROPDOWN_MIN_VISIBLE_OPTIONS,
  DROPDOWN_SCROLL_LOAD_THRESHOLD_PX,
} from '@/shared/constants/general';
import {LIST_TOOLBAR} from '@/shared/constants/listToolbar';
import useTranslation from '@/shared/hooks/useTranslation';
import {AddFilterValuesProps} from '@/shared/interfaces/listToolbar';
import {getFilterQualifierKey} from '@/shared/utils/listToolbar';

import AddFilterOptionList from './AddFilterOptionList';

const AddFilterValues = ({
  field,
  draft,
  onDraftChange,
  onReset,
  onApply,
}: AddFilterValuesProps) => {
  const {t} = useTranslation();
  const [query, setQuery] = useState('');

  const {onQueryChange, onLoadMore, hasMore, isLoading, isLoadingMore} = field;
  const optionCount = field.options.length;

  // A short page leaves nothing to scroll, so it fetches the next one itself.
  useEffect(() => {
    if (
      optionCount < DROPDOWN_MIN_VISIBLE_OPTIONS &&
      hasMore &&
      !isLoading &&
      !isLoadingMore
    )
      onLoadMore?.();
  }, [optionCount, hasMore, isLoading, isLoadingMore, onLoadMore]);

  const handleOptionsScroll = (event: UIEvent<HTMLElement>) => {
    const {scrollTop, clientHeight, scrollHeight} = event.currentTarget;
    const distanceToEnd = scrollHeight - scrollTop - clientHeight;

    if (
      hasMore &&
      !isLoadingMore &&
      distanceToEnd <= DROPDOWN_SCROLL_LOAD_THRESHOLD_PX
    )
      onLoadMore?.();
  };

  useEffect(() => {
    onQueryChange?.({term: query});
  }, [query, onQueryChange]);

  useEffect(() => () => onQueryChange?.({term: ''}), [onQueryChange]);

  return (
    <Box className='bg-surface-raised flex min-w-0 flex-1 flex-col'>
      <Typography
        variant='small'
        className='text-ink-muted px-3 pt-3 pb-2 font-semibold'
      >
        {field.label}{' '}
        <span className='text-ink-faint font-normal'>
          · {t(getFilterQualifierKey({field}))}
        </span>
      </Typography>

      {field.disabled ? (
        <Typography variant='small' className='text-ink-muted px-3.5 pb-4'>
          {t('listToolbar.notAvailable', {label: field.label})}
        </Typography>
      ) : (
        <>
          {field.searchable && (
            <Box className='px-3 pb-2'>
              <TextField
                size='small'
                fullWidth
                autoFocus
                value={query}
                placeholder={t('listToolbar.searchOptions')}
                onChange={(event) => setQuery(event.target.value)}
                slotProps={{
                  htmlInput: {'aria-label': t('listToolbar.searchOptions')},
                }}
              />
            </Box>
          )}

          <Box
            className='overflow-y-auto px-1.5 pb-1.5'
            sx={{maxHeight: LIST_TOOLBAR.optionsMaxHeight}}
            onScroll={onLoadMore ? handleOptionsScroll : undefined}
          >
            <AddFilterOptionList
              field={field}
              query={query}
              draft={draft}
              onDraftChange={onDraftChange}
            />
          </Box>
        </>
      )}

      <Box
        className='bg-surface mt-auto flex items-center gap-2 px-3 py-2'
        sx={{borderTop: 1, borderColor: 'customColors.ruleStrong'}}
      >
        {!field.disabled && (
          <Button size='small' color='secondary' onClick={onReset}>
            {t('listToolbar.reset')}
          </Button>
        )}
        <Button
          size='small'
          variant='contained'
          className='ml-auto'
          disabled={field.disabled}
          onClick={onApply}
        >
          {t('listToolbar.apply')}
        </Button>
      </Box>
    </Box>
  );
};

export default AddFilterValues;
