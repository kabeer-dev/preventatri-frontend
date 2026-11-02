'use client';

import {Controller, FieldValues} from 'react-hook-form';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/shared/components/ui/input-otp';
import {OtpInputProps} from '@/shared/interfaces/inputs';

import ErrorMessage from './errorMessage';
import FieldLabel from './FieldLabel';

export const OtpInput = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  hideLabel = false,
}: OtpInputProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => (
        <div className='flex flex-col gap-2'>
          {label && !hideLabel && <FieldLabel>{label}</FieldLabel>}
          <InputOTP
            maxLength={8}
            value={field.value}
            onChange={field.onChange}
            ariaLabel={label}
          >
            <InputOTPGroup>
              {Array.from({length: 8}).map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {error && <ErrorMessage errorMsg={error.message} />}
        </div>
      )}
    />
  );
};
