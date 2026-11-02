'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import {SentStateProps} from '@/shared/interfaces/uiComponents';

const ICON_BACKGROUND = {
  success: 'customColors.severityStableBg',
  error: 'customColors.severityCriticalBg',
};

/**
 * The caregiver's sent screen, for a checklist and for a red flag alike. The
 * phone has no room for a measured column, so the lines run to the gutters
 * and wrap at a space rather than inside a word.
 */
const SentState = ({
  icon,
  color,
  title,
  lines,
  align = 'center',
  children,
  sx,
}: SentStateProps) => {
  const isDesktop = useIsDesktop();

  const isCentered = align === 'center';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCentered ? 'center' : 'flex-start',
        textAlign: isCentered ? 'center' : 'left',
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          backgroundColor: ICON_BACKGROUND[color],
          color: `${color}.main`,
        }}
      >
        <Icon icon={icon} fontSize={30} />
      </Box>

      <Typography
        variant='h1'
        sx={{
          fontSize: isDesktop ? '2rem' : undefined,
          mt: 5.5,
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </Typography>

      {lines.map((line, index) => (
        <Typography
          key={line}
          sx={{
            fontSize: '0.96875rem',
            color: 'text.secondary',
            lineHeight: 1.55,
            width: '100%',
            maxWidth: isDesktop ? '34ch' : '100%',
            mx: isCentered ? 'auto' : 0,
            mt: index === 0 ? 3 : 2,
            wordBreak: 'normal',
            overflowWrap: 'break-word',
          }}
        >
          {line}
        </Typography>
      ))}

      {children}
    </Box>
  );
};

export default SentState;
