'use client';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import {ESCALATION_STEP_OPTIONS} from '@/shared/constants/settings';
import useTranslation from '@/shared/hooks/useTranslation';
import {EscalationTypeSelectProps} from '@/shared/interfaces/settings';
import {EscalationStepType} from '@/shared/types/settings';

const EscalationTypeSelect = ({
  step,
  typeOptions,
  disabled,
  onTypeChange,
}: EscalationTypeSelectProps) => {
  const {t} = useTranslation();

  return (
    <Select<EscalationStepType>
      size='small'
      fullWidth
      value={step.type}
      disabled={disabled}
      inputProps={{
        'aria-label': t('escalationSettings.columns.whoIsNotified'),
      }}
      onChange={(event) =>
        onTypeChange({
          id: step.id,
          type: event.target.value as EscalationStepType,
        })
      }
    >
      {ESCALATION_STEP_OPTIONS.filter(({value}) =>
        typeOptions.includes(value)
      ).map(({value, labelKey}) => (
        <MenuItem key={value} value={value}>
          {t(labelKey)}
        </MenuItem>
      ))}
    </Select>
  );
};

export default EscalationTypeSelect;
