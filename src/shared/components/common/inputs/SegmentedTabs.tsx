'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import {controlHeight, radius} from '@/@core/theme/spacing';
import {SegmentedTabsProps} from '@/shared/interfaces/inputs';
import {cn} from '@/shared/utils/tailwindUtils';

// The pill group that switches a list between its named subsets. Buttons rather
// than tabs, because the panel below never changes identity - only what it is
// filtered to - so `aria-pressed` describes the control honestly.
const SegmentedTabs = ({
  value,
  options,
  onChange,
  ariaLabel,
  disabled = false,
  fullWidth = false,
  flat = false,
  showIndicator = false,
}: SegmentedTabsProps) => (
  <Box
    role='group'
    aria-label={ariaLabel}
    className={cn(
      'bg-segment-track gap-1.5 p-1',
      fullWidth ? 'flex w-full' : 'inline-flex max-w-full flex-wrap'
    )}
    sx={{borderRadius: `${radius.md}px`, minHeight: controlHeight.md}}
  >
    {options.map((option) => {
      const isSelected = option.value === value;

      return (
        <ButtonBase
          key={option.value}
          aria-pressed={isSelected}
          disabled={disabled || !!option.disabled}
          title={option.disabled ? option.disabledReason : undefined}
          onClick={() => onChange({value: option.value})}
          sx={{
            flex: fullWidth ? 1 : 'none',
            px: 3.5,

            // The track's 4px padding plus a small control lines the group up
            // with a medium field, so tabs, search and buttons share a height.
            minHeight: controlHeight.sm,
            borderRadius: `${radius.sm}px`,
            bgcolor: isSelected ? 'background.paper' : 'transparent',
            boxShadow: isSelected && !flat ? 1 : 0,
            gap: 1.75,

            // Keeps the disabled reason reachable as a tooltip on hover.
            '&.Mui-disabled': {pointerEvents: 'auto', cursor: 'not-allowed'},
          }}
        >
          {showIndicator && (
            <Box
              component='span'
              aria-hidden
              sx={{
                width: 6,
                height: 6,
                flex: 'none',
                borderRadius: `${radius.full}px`,
                bgcolor: isSelected ? 'primary.main' : 'customColors.inkFaint',
              }}
            />
          )}
          <Typography
            variant='small'
            sx={{
              whiteSpace: 'nowrap',
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? 'text.primary' : 'customColors.inkSoft',
              opacity: option.disabled ? 0.6 : 1,
            }}
          >
            {option.label}
            {option.count !== undefined && (
              <Box
                component='span'
                sx={{ml: 1.25, fontVariantNumeric: 'tabular-nums'}}
              >
                {option.count}
              </Box>
            )}
          </Typography>
        </ButtonBase>
      );
    })}
  </Box>
);

export default SegmentedTabs;
