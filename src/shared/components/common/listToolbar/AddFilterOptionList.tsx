'use client';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';

import {LIST_FILTER_KINDS} from '@/shared/constants/listToolbar';
import useTranslation from '@/shared/hooks/useTranslation';
import {AddFilterOptionListProps} from '@/shared/interfaces/listToolbar';

import {filterOptionSx} from './styles';

const AddFilterOptionList = ({
  field,
  query,
  draft,
  onDraftChange,
}: AddFilterOptionListProps) => {
  const {t} = useTranslation();
  const normalizedQuery = query.trim().toLowerCase();

  const options = field.onQueryChange
    ? field.options
    : field.options.filter((option) =>
        option.label.toLowerCase().includes(normalizedQuery)
      );

  if (field.isLoading && !options.length) {
    return (
      <Box className='flex justify-center py-4'>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (!options.length) {
    return (
      <Typography
        variant='small'
        className='text-ink-subtle block px-3.5 py-2.5'
      >
        {normalizedQuery
          ? t('listToolbar.noMatches', {
              query,
              interpolation: {escapeValue: false},
            })
          : t('listToolbar.noOptions')}
      </Typography>
    );
  }

  const loadingMore = field.isLoadingMore && (
    <Box className='flex justify-center py-2'>
      <CircularProgress size={16} />
    </Box>
  );

  if (field.kind === LIST_FILTER_KINDS.multi) {
    return (
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            sx={filterOptionSx}
            label={option.label}
            control={
              <Checkbox
                size='small'
                checked={draft.includes(option.value)}
                onChange={(event) =>
                  onDraftChange({
                    values: event.target.checked
                      ? [...draft, option.value]
                      : draft.filter((value) => value !== option.value),
                  })
                }
              />
            }
          />
        ))}
        {loadingMore}
      </FormGroup>
    );
  }

  return (
    <RadioGroup
      value={draft[0] ?? ''}
      onChange={(event) => onDraftChange({values: [event.target.value]})}
    >
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          sx={filterOptionSx}
          label={option.label}
          control={
            <Radio
              size='small'

              // RadioGroup fires no change for the picked option, so a
              // second click on it clears the choice here.
              onClick={() => {
                if (draft[0] === option.value) onDraftChange({values: []});
              }}
            />
          }
        />
      ))}
      {loadingMore}
    </RadioGroup>
  );
};

export default AddFilterOptionList;
