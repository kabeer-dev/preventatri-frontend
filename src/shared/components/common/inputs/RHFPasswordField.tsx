'use client';

import {useState} from 'react';

import IconButton from '@mui/material/IconButton';
import {TextFieldProps} from '@mui/material/TextField';
import {Control, FieldValues, Path, useWatch} from 'react-hook-form';

import Icon from '@/@core/components/icon';
import useTranslation from '@/shared/hooks/useTranslation';

import PasswordPolicyChecklist from './PasswordPolicyChecklist';
import RHFTextField from './RHFTextField';

// slotProps is omitted, as InputProps was before v9, because this component owns
// the input slot: it injects the visibility toggle as the endAdornment. Letting
// a caller pass slotProps would silently drop one side or the other, and the
// input slot accepts a callback form that cannot be merged by spreading.
type RHFPasswordFieldProps<T extends FieldValues> = Omit<
  TextFieldProps,
  'name' | 'type' | 'slotProps'
> & {
  name: Path<T>;
  control: Control<T>;
  showPolicyChecklist?: boolean;
  labelAction?: React.ReactNode;
};

const RHFPasswordField = <T extends FieldValues>({
  name,
  control,
  showPolicyChecklist = false,
  ...other
}: RHFPasswordFieldProps<T>) => {
  const {t} = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const password = useWatch({control, name}) || '';

  return (
    <>
      <RHFTextField
        {...other}
        name={name}
        control={control}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          input: {
            className: 'pr-0',
            endAdornment: (
              <IconButton
                size='small'
                onClick={() => setShowPassword((prev) => !prev)}
                onMouseDown={(e) => e.preventDefault()}
                aria-label={
                  showPassword ? t('auth.hidePassword') : t('auth.showPassword')
                }
                className='text-ink-muted absolute top-1/2 right-2 -translate-y-1/2'
              >
                <Icon
                  icon={
                    showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'
                  }
                  fontSize={20}
                />
              </IconButton>
            ),
          },
          htmlInput: {className: 'pr-11'},
        }}
      />
      {showPolicyChecklist && password && (
        <div className='mt-3'>
          <PasswordPolicyChecklist password={password} />
        </div>
      )}
    </>
  );
};

export default RHFPasswordField;
