'use client';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

import useTranslation from '@/shared/hooks/useTranslation';
import {ListToolbarFiltersProps} from '@/shared/interfaces/listToolbar';
import {formatFilterValues} from '@/shared/utils/listToolbar';

const AppliedFilterChips = ({
  fields,
  onRemove,
  onClearAll,
}: ListToolbarFiltersProps) => {
  const {t} = useTranslation();
  const appliedFields = fields.filter((field) => field.values.length);

  if (!appliedFields.length) return null;

  return (
    <Box className='flex flex-wrap items-center gap-2'>
      {appliedFields.map((field) => (
        <Chip
          key={field.param}
          size='small'
          label={
            <span className='inline-flex items-center gap-1.5'>
              <span className='text-brand-muted font-normal'>
                {field.label}
              </span>
              <span>{formatFilterValues({field, t})}</span>
            </span>
          }
          onDelete={() => onRemove({param: field.param})}
          deleteIcon={
            <Icon
              icon='mdi:close'
              role='img'
              aria-hidden={false}
              aria-label={t('listToolbar.removeFilter', {
                label: field.label,
                interpolation: {escapeValue: false},
              })}
            />
          }
          sx={{
            bgcolor: 'customColors.brandTint',
            color: 'primary.dark',
            '& .MuiChip-deleteIcon': {
              fontSize: 14,
              color: 'primary.dark',
              opacity: 0.75,
              '&:hover': {color: 'primary.dark', opacity: 1},
            },
          }}
        />
      ))}

      <Button size='small' onClick={onClearAll}>
        {t('listToolbar.clearAll')}
      </Button>
    </Box>
  );
};

export default AppliedFilterChips;
