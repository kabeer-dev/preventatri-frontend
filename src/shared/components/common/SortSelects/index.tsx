import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import {SortSelectsProps} from '@/shared/interfaces/inputs';
import {createOptionsFromObject} from '@/shared/utils/general';

const SortSelects = ({
  sortValue,
  sortConfig,
  setSortField,
  setDirection,
}: SortSelectsProps) => {
  if (!sortConfig || Object.keys(sortConfig).length === 0) return null;

  const selects = [
    {
      value: sortValue.sortBy || '',
      onChange: setSortField,
      placeholder: 'Sort By',
      options: createOptionsFromObject({obj: sortConfig.options}),
    },
    {
      value: sortValue.sortDir || '',
      onChange: setDirection,
      placeholder: 'Direction',
      options: createOptionsFromObject({obj: sortConfig.directions}),
    },
  ];

  return (
    <Box className='flex-start gap-3 my-3 w-full'>
      {selects.map(({value, onChange, placeholder, options}) => (
        <FormControl key={placeholder} fullWidth size='small'>
          <Select
            displayEmpty
            value={value}
            onChange={(e) => onChange(String(e.target.value))}
          >
            <MenuItem value='' disabled>
              {placeholder}
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Box>
  );
};

export default SortSelects;
