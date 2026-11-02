'use client';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import {alpha} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import {ALERT_REVIEW_SIZES} from '@/shared/constants/alertReview';
import {ResolutionActionOptionProps} from '@/shared/interfaces/alertReview';

const ResolutionActionOption = ({
  label,
  checked,
  disabled,
  onChange,
}: ResolutionActionOptionProps) => (
  <Box
    component='label'
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2.5,
      py: 1.5,
      pl: 2.5,
      pr: 4.5,
      borderLeft: `${ALERT_REVIEW_SIZES.actionBar}px solid`,
      borderLeftColor: checked ? 'primary.main' : 'transparent',
      backgroundColor: (theme) =>
        checked ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
      color: checked ? 'primary.dark' : 'text.secondary',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'background-color .15s, border-color .15s',
      '&:hover': {
        backgroundColor: checked ? undefined : 'action.hover',
      },
    }}
  >
    <Checkbox
      size='small'
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
      sx={{p: 0.5}}
    />
    <Typography
      component='span'
      sx={{fontSize: 13.5, fontWeight: checked ? 700 : 500, color: 'inherit'}}
    >
      {label}
    </Typography>
  </Box>
);

export default ResolutionActionOption;
