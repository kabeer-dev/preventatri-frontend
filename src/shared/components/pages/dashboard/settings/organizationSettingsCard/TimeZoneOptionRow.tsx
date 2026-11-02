'use client';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {TimeZoneOptionRowProps} from '@/shared/interfaces/settings';
import {DateTime} from '@/shared/utils/dateUtils';

// One time zone's name, cities, GMT offset and live local time. Used for the
// read-only selected zone, the dropdown's trigger and each dropdown option.
const TimeZoneOptionRow = ({option, now}: TimeZoneOptionRowProps) => {
  const shortLabel = option.label.split(' (')[0];
  const zonedNow = DateTime.fromMillis(now).setZone(option.value);

  return (
    <Stack
      direction='row'
      sx={{
        alignItems: 'center',
        flexWrap: 'wrap',
        rowGap: 0.5,
        columnGap: {xs: 1.5, sm: 2},
        width: '100%',
        minWidth: 0,
      }}
    >
      <Stack sx={{flex: 1, minWidth: 96}}>
        <Typography variant='body2' noWrap sx={{fontWeight: 700}}>
          {shortLabel}
        </Typography>
        <Typography variant='caption' noWrap sx={{color: 'text.secondary'}}>
          {option.cities}
        </Typography>
      </Stack>

      <Chip
        label={`GMT${zonedNow.toFormat('ZZ')}`}
        size='small'
        sx={{
          flexShrink: 0,
          bgcolor: 'action.hover',
          fontWeight: 600,
          fontSize: 12,
        }}
      />

      <Typography
        variant='body2'
        sx={{
          flexShrink: 0,
          fontWeight: 700,
          minWidth: 92,
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
          color: 'primary.main',
        }}
      >
        {zonedNow.toFormat('h:mm:ss a')}
      </Typography>
    </Stack>
  );
};

export default TimeZoneOptionRow;
