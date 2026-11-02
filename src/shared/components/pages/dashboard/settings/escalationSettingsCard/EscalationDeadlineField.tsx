'use client';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import {ESCALATION_TTL_UNITS} from '@/shared/constants/settings';
import useTranslation from '@/shared/hooks/useTranslation';
import {EscalationDeadlineFieldProps} from '@/shared/interfaces/settings';
import {EscalationTtlUnit} from '@/shared/types/settings';
import {isDraftStepDeadlineValid} from '@/shared/utils/escalationPolicyUtils';

const EscalationDeadlineField = ({
  step,
  disabled,
  onTtlValueChange,
  onTtlUnitChange,
}: EscalationDeadlineFieldProps) => {
  const {t} = useTranslation();

  return (
    <Box className='flex gap-1.5'>
      <TextField
        size='small'
        value={step.ttlValue}
        disabled={disabled}
        error={!isDraftStepDeadlineValid({step})}
        onChange={(event) =>
          onTtlValueChange({id: step.id, value: event.target.value})
        }
        slotProps={{
          htmlInput: {
            inputMode: 'numeric',
            'aria-label': t('escalationSettings.columns.deadline'),
          },
        }}
        sx={{width: 72, flex: 'none'}}
      />
      <Select<EscalationTtlUnit>
        size='small'
        fullWidth
        value={step.ttlUnit}
        disabled={disabled}
        inputProps={{
          'aria-label': t('escalationSettings.deadlineUnitAriaLabel'),
        }}
        onChange={(event) =>
          onTtlUnitChange({
            id: step.id,
            unit: event.target.value as EscalationTtlUnit,
          })
        }
      >
        {(Object.keys(ESCALATION_TTL_UNITS) as EscalationTtlUnit[]).map(
          (unit) => (
            <MenuItem key={unit} value={unit}>
              {t(`escalationSettings.units.${unit}`)}
            </MenuItem>
          )
        )}
      </Select>
    </Box>
  );
};

export default EscalationDeadlineField;
