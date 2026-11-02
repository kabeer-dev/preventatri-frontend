'use client';

import {Icon} from '@iconify/react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import {DATA_TABLE} from '@/shared/constants/common';
import useTranslation from '@/shared/hooks/useTranslation';
import {ListSearchFieldProps} from '@/shared/interfaces/listToolbar';

const ListSearchField = ({
  value,
  onChange,
  placeholder,
  size,
  sx,
}: ListSearchFieldProps) => {
  const {t} = useTranslation();

  return (
    <TextField
      size={size}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange({val: event.target.value})}
      sx={[
        {
          minWidth: 0,
          flex: {xs: '1 1 auto', sm: '0 1 auto'},
          width: {sm: DATA_TABLE.searchWidth},
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      slotProps={{
        htmlInput: {'aria-label': placeholder},
        input: {
          startAdornment: (
            <InputAdornment position='start'>
              <Icon
                icon='mdi:magnify'
                fontSize={18}
                className='text-ink-faint'
              />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position='end'>
              <IconButton
                size='small'
                edge='end'
                aria-label={t('listToolbar.clearSearch')}
                onClick={() => onChange({val: ''})}
              >
                <Icon icon='mdi:close' fontSize={16} />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
};

export default ListSearchField;
