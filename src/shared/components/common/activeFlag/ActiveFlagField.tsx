import Box from '@mui/material/Box';
import {alpha} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import {radius} from '@/@core/theme/spacing';
import {ACTIVE_FLAG_MODAL_SIZES} from '@/shared/constants/flag';
import {ActiveFlagFieldProps} from '@/shared/interfaces/flag';

const ActiveFlagField = ({
  label,
  children,
  variant = 'default',
  accent,
  startAdornment,
}: ActiveFlagFieldProps) => {
  const isKey = variant === 'key' && accent;
  const isLong = variant === 'long';

  return (
    <Box sx={{display: 'grid', gap: 1.5, minWidth: 0}}>
      <Typography
        component='span'
        sx={{color: 'text.primary', fontSize: 12, fontWeight: 600}}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: isLong ? 'block' : 'flex',
          alignItems: 'center',
          gap: 2.5,
          minHeight: ACTIVE_FLAG_MODAL_SIZES.fieldMinHeight,
          pr: 3,
          pl: startAdornment && !isKey ? 2 : 3,
          py: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: `${radius.sm}px`,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          fontSize: 14,
          fontWeight: 500,
          overflowWrap: 'anywhere',
          ...(isLong && {
            py: 2.5,
            color: 'text.secondary',
            fontWeight: 400,
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
          }),
          ...(isKey && {
            pr: 3.5,
            pl: 3.5,
            py: 2.75,
            border: '1.5px solid',
            borderColor: accent.edge,
            backgroundColor: accent.tint,
            color: accent.ink,
            fontSize: 15,
            fontWeight: 700,
            boxShadow: `0 0 0 3px ${alpha(accent.edge, 0.12)}`,
          }),
        }}
      >
        {startAdornment}
        {children}
      </Box>
    </Box>
  );
};

export default ActiveFlagField;
