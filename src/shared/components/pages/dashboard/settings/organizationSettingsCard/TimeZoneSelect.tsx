'use client';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import {TIME_ZONE_OPTIONS} from '@/shared/constants/settings';
import {TimeZoneSelectProps} from '@/shared/interfaces/settings';
import {TimeZoneKey} from '@/shared/types/settings';

import TimeZoneOptionRow from './TimeZoneOptionRow';

// Edit-mode time zone dropdown: the trigger and every option show the zone's
// name, cities, GMT offset and live local time.
const TimeZoneSelect = ({value, now, onChange}: TimeZoneSelectProps) => (
  <Select<TimeZoneKey | ''>
    fullWidth
    value={value ?? ''}
    onChange={(event) => {
      if (event.target.value) onChange(event.target.value as TimeZoneKey);
    }}
    renderValue={(selected) => {
      const option = TIME_ZONE_OPTIONS.find((item) => item.key === selected);

      return option ? <TimeZoneOptionRow option={option} now={now} /> : null;
    }}
    sx={{bgcolor: 'background.paper', '& .MuiSelect-select': {py: 1.5}}}
  >
    {TIME_ZONE_OPTIONS.map((option) => (
      <MenuItem key={option.key} value={option.key} sx={{py: 1.5}}>
        <TimeZoneOptionRow option={option} now={now} />
      </MenuItem>
    ))}
  </Select>
);

export default TimeZoneSelect;
