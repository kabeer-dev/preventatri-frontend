'use client';

import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import {ESCALATION_CHANNELS} from '@/shared/constants/settings';
import useTranslation from '@/shared/hooks/useTranslation';
import {EscalationChannelsSelectProps} from '@/shared/interfaces/settings';
import {EscalationChannel} from '@/shared/types/settings';

// Multi-select of the channels a step pages on, shown as "Push + SMS".
const EscalationChannelsSelect = ({
  value,
  disabled,
  onChange,
}: EscalationChannelsSelectProps) => {
  const {t} = useTranslation();

  return (
    <Select<EscalationChannel[]>
      multiple
      fullWidth
      size='small'
      displayEmpty
      value={value}
      disabled={disabled}
      error={value.length === 0}
      inputProps={{'aria-label': t('escalationSettings.columns.notifyVia')}}
      onChange={(event) =>
        onChange(
          (typeof event.target.value === 'string'
            ? event.target.value.split(',')
            : event.target.value) as EscalationChannel[]
        )
      }
      renderValue={(selected) =>
        selected.length
          ? selected
              .map((channel) => t(`escalationSettings.channels.${channel}`))
              .join(' + ')
          : t('escalationSettings.noChannel')
      }
    >
      {ESCALATION_CHANNELS.map((channel) => (
        <MenuItem key={channel} value={channel} dense>
          <Checkbox size='small' checked={value.includes(channel)} />
          <ListItemText primary={t(`escalationSettings.channels.${channel}`)} />
        </MenuItem>
      ))}
    </Select>
  );
};

export default EscalationChannelsSelect;
