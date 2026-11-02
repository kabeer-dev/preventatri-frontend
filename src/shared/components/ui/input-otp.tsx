'use client';

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  forwardRef,
} from 'react';

import {cn} from '@/shared/utils/tailwindUtils';

interface InputOTPContextValue {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
}

const InputOTPContext = createContext<InputOTPContextValue | null>(null);

const useInputOTP = () => {
  const context = useContext(InputOTPContext);
  if (!context) {
    throw new Error('useInputOTP must be used within InputOTP');
  }

  return context;
};

interface InputOTPProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export const InputOTP = forwardRef<HTMLDivElement, InputOTPProps>(
  ({value, onChange, maxLength, children, className = '', ariaLabel}, ref) => {
    const [focusedIndex, setFocusedIndex] = useState(-1);

    return (
      <InputOTPContext.Provider
        value={{
          value,
          onChange,
          maxLength,
          focusedIndex,
          setFocusedIndex,
        }}
      >
        <div
          ref={ref}
          className={`flex items-center gap-1 sm:gap-2 w-full ${className}`}
          role='group'
          aria-label={ariaLabel}
        >
          {children}
        </div>
      </InputOTPContext.Provider>
    );
  }
);

InputOTP.displayName = 'InputOTP';

interface InputOTPGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const InputOTPGroup = ({
  children,
  className = '',
}: InputOTPGroupProps) => {
  return (
    <div
      className={`flex items-center gap-1 sm:gap-2 w-full ${className}`}
      role='presentation'
    >
      {children}
    </div>
  );
};

interface InputOTPSlotProps {
  index: number;
  className?: string;
}

export const InputOTPSlot = ({index, className = ''}: InputOTPSlotProps) => {
  const {value, onChange, maxLength, focusedIndex, setFocusedIndex} =
    useInputOTP();
  const inputRef = useRef<HTMLInputElement>(null);
  const char = value[index] || '';

  useEffect(() => {
    if (focusedIndex === index && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusedIndex, index]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Handle paste event
    if (newValue.length > 1) {
      const pastedText = newValue.slice(0, maxLength);
      const newOtpValue = value.split('');

      for (let i = 0; i < pastedText.length; i++) {
        if (index + i < maxLength) {
          newOtpValue[index + i] = pastedText[i];
        }
      }

      onChange(newOtpValue.join('').slice(0, maxLength));

      // Focus the next empty slot or the last slot
      const nextIndex = Math.min(index + pastedText.length, maxLength - 1);
      setFocusedIndex(nextIndex);

      return;
    }

    // Handle single character input
    if (newValue.length === 1 && /^[0-9]$/.test(newValue)) {
      const newOtpValue = value.split('');
      newOtpValue[index] = newValue;
      onChange(newOtpValue.join(''));

      // Auto-focus next input
      if (index < maxLength - 1) {
        setFocusedIndex(index + 1);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();

      if (char) {
        // Clear current slot
        const newOtpValue = value.split('');
        newOtpValue[index] = '';
        onChange(newOtpValue.join(''));
      } else if (index > 0) {
        // Move to previous slot and clear it
        const newOtpValue = value.split('');
        newOtpValue[index - 1] = '';
        onChange(newOtpValue.join(''));
        setFocusedIndex(index - 1);
      }
    } else if (e.key === 'Delete') {
      e.preventDefault();

      // Clear current slot
      const newOtpValue = value.split('');
      newOtpValue[index] = '';
      onChange(newOtpValue.join(''));
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < maxLength - 1) {
      e.preventDefault();
      setFocusedIndex(index + 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedIndex(maxLength - 1);
    }
  };

  const handleFocus = () => {
    setFocusedIndex(index);

    // Select the input content on focus
    inputRef.current?.select();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '');

    if (pastedText.length > 0) {
      const newOtpValue = value.split('');

      for (let i = 0; i < pastedText.length; i++) {
        if (index + i < maxLength) {
          newOtpValue[index + i] = pastedText[i];
        }
      }

      onChange(newOtpValue.join('').slice(0, maxLength));

      // Focus the next empty slot or the last slot
      const nextIndex = Math.min(index + pastedText.length, maxLength - 1);
      setFocusedIndex(nextIndex);
    }
  };

  return (
    <input
      ref={inputRef}
      type='text'
      inputMode='numeric'
      pattern='[0-9]*'
      maxLength={1}
      value={char}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onPaste={handlePaste}
      className={cn(
        'border-border bg-surface text-ink focus:border-brand focus-visible:outline-brand h-12 w-full min-w-0 flex-1 rounded-xl border text-center font-mono text-lg font-medium focus-visible:outline-2 focus-visible:outline-offset-2 sm:h-15.5 sm:text-2xl',
        className
      )}
      aria-label={`OTP digit ${index + 1}`}
    />
  );
};
