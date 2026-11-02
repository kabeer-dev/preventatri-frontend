'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import {alpha, useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import {radius} from '@/@core/theme/spacing';
import {CAREGIVER_RUNNER} from '@/shared/constants/caregiver';
import {SelectableOptionProps} from '@/shared/interfaces/checklist';

const CheckmarkSvg = () => (
  <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
    <path
      d='M2 6L5 9L10 3'
      stroke='white'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

/** The row and the control at each size. Only the phone gets a thumb sized row. */
const SIZE_SX = {
  small: {
    row: {gap: 2, py: 1.5, px: 0.5},
    control: 20,
    label: {},
    labelOnly: {},
  },
  medium: {
    row: {gap: 3.5, px: 4.5, minHeight: 52},
    control: 22,
    label: {fontSize: '0.9375rem', fontWeight: 600},
    labelOnly: {minHeight: 56, fontSize: '1rem'},
  },
  large: {
    row: {gap: 3.5, px: 4.5, minHeight: CAREGIVER_RUNNER.optionRowHeight},
    control: 22,
    label: {fontSize: '1rem', fontWeight: 600},
    labelOnly: {
      minHeight: CAREGIVER_RUNNER.answerButtonHeight,
      fontSize: '1.125rem',
    },
  },
} as const;

/**
 * One answer a person can pick: a radio or a checkbox drawn by hand so every
 * checklist form shows the same control. A real button, so the keyboard
 * reaches it and a disabled fieldset locks it.
 */
const SelectableOption = ({
  label,
  selected,
  variant,
  onClick,
  size = 'small',
  labelOnly = false,
}: SelectableOptionProps) => {
  const theme = useTheme();
  const color = theme.palette.primary.main;
  const isRadio = variant === 'radio';

  const sizeSx = SIZE_SX[size];

  // The runner's rows stand alone, so they carry their own border and tint.
  const isOutlined = size !== 'small';

  const outlinedSx = {
    borderRadius: `${radius.md}px`,
    border: '2px solid',
    borderColor: selected ? 'primary.main' : 'divider',
    backgroundColor: selected ? 'customColors.brandTint' : 'transparent',
    color: selected ? 'primary.dark' : 'text.primary',
    '&:hover': {
      borderColor: 'primary.main',
      ...(!selected && {backgroundColor: 'action.hover'}),
      ...(labelOnly && {backgroundColor: 'customColors.brandTint'}),
    },
  };

  return (
    <ButtonBase
      disableRipple
      onClick={onClick}
      role={isRadio ? 'radio' : 'checkbox'}
      aria-checked={selected}
      className={isOutlined ? undefined : 'rounded'}
      sx={{
        width: '100%',
        justifyContent: labelOnly ? 'center' : 'flex-start',
        textAlign: 'left',
        transition: 'background-color 0.15s ease',
        '&.Mui-focusVisible, &:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '2px',
        },
        ...(labelOnly
          ? {
              ...sizeSx.labelOnly,
              fontWeight: 700,
            }
          : sizeSx.row),
        ...(isOutlined
          ? outlinedSx
          : {'&:hover': {bgcolor: alpha(color, 0.04)}}),
      }}
    >
      {labelOnly ? (
        label
      ) : (
        <>
          <Box
            sx={{
              width: sizeSx.control,
              height: sizeSx.control,
              minWidth: sizeSx.control,
              borderRadius: isRadio ? '50%' : 0.5,
              border: '2px solid',
              borderColor: selected ? color : theme.palette.text.disabled,
              bgcolor: !isRadio && selected ? color : 'transparent',
              transition: 'all 0.15s ease',
            }}
            className='flex items-center justify-center'
          >
            {selected &&
              (isRadio ? (
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: color,
                  }}
                />
              ) : (
                <CheckmarkSvg />
              ))}
          </Box>
          <Typography
            variant='body2'
            sx={{
              fontWeight: selected ? 600 : 400,
              color: selected ? 'text.primary' : 'text.secondary',
              ...(isOutlined && {...sizeSx.label, color: 'inherit'}),
            }}
          >
            {label}
          </Typography>
        </>
      )}
    </ButtonBase>
  );
};

export default SelectableOption;
