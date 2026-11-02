'use client';

import {useState} from 'react';

import {pickersOutlinedInputClasses} from '@mui/x-date-pickers/PickersTextField';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';

import {radius} from '@/@core/theme/spacing';
import {ORGANIZATION_SETTINGS_LAYOUT} from '@/shared/constants/settings';
import {DateTime} from '@/shared/utils/dateUtils';

const TimeField = ({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const parsedValue = DateTime.fromFormat(value, 'HH:mm');

  return (
    <TimePicker
      value={parsedValue.isValid ? parsedValue : null}
      disabled={disabled}
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      onChange={(newValue) => {
        if (newValue?.isValid) onChange(newValue.toFormat('HH:mm'));
      }}
      slotProps={{
        textField: {
          size: 'small',
          onClick: () => {
            if (!disabled) setIsOpen(true);
          },
          sx: {
            width: ORGANIZATION_SETTINGS_LAYOUT.timeFieldWidth,
            flexShrink: 0,
            [`& .${pickersOutlinedInputClasses.root}`]: {
              borderRadius: `${radius.sm}px`,
            },
          },
        },
      }}
    />
  );
};

export default TimeField;
