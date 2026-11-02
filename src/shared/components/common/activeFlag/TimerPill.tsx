'use client';

import Box from '@mui/material/Box';
import {alpha, useTheme} from '@mui/material/styles';

import Icon from '@/@core/components/icon';
import {radius} from '@/@core/theme/spacing';
import typography from '@/@core/theme/typography';
import {ACTIVE_FLAG_MODAL_SIZES} from '@/shared/constants/flag';
import {TimerPillProps} from '@/shared/interfaces/flag';

const TimerPill = ({
  icon,
  label,
  value,
  accentColor,
  emphasis = 'solid',
}: TimerPillProps) => {
  const theme = useTheme();

  const accentMain = theme.palette[accentColor].main;
  const isSolid = emphasis === 'solid';

  return (
    <Box
      role='timer'
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        height: ACTIVE_FLAG_MODAL_SIZES.countdownHeight,
        pl: 2.75,
        pr: value ? 0.75 : 3,
        py: 0.75,
        borderRadius: `${radius.full}px`,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: alpha(accentMain, 0.4),
        boxShadow: `0 1px 2px ${alpha(theme.palette.customColors.shell, 0.06)}`,
        color: 'text.secondary',
        fontSize: 12.5,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <Box
        component='span'
        sx={{display: 'inline-flex', color: `${accentColor}.main`}}
      >
        <Icon icon={icon} fontSize={16} />
      </Box>
      {label}
      {value && (
        <Box
          component='span'
          sx={{
            display: 'inline-grid',
            placeItems: 'center',
            height: '100%',
            minWidth: ACTIVE_FLAG_MODAL_SIZES.countdownDigitsMinWidth,
            px: 2.5,
            borderRadius: `${radius.full}px`,
            backgroundColor: isSolid
              ? `${accentColor}.main`
              : alpha(accentMain, 0.12),
            color: isSolid
              ? `${accentColor}.contrastText`
              : `${accentColor}.main`,
            fontFamily: typography.mono.fontFamily,
            fontSize: 13.5,
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.03em',
          }}
        >
          {value}
        </Box>
      )}
    </Box>
  );
};

export default TimerPill;
