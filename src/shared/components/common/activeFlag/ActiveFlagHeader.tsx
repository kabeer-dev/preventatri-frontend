'use client';

import Box from '@mui/material/Box';
import {alpha} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import AcceptedPill from '@/shared/components/common/activeFlag/AcceptedPill';
import OpenForPill from '@/shared/components/common/activeFlag/OpenForPill';
import SeverityIconTile from '@/shared/components/common/activeFlag/SeverityIconTile';
import ExpiryCountdown from '@/shared/components/common/ExpiryCountdown';
import DialogCloseButton from '@/shared/components/common/modals/DialogCloseButton';
import {ActiveFlagHeaderProps} from '@/shared/interfaces/flag';

const ActiveFlagHeader = ({
  accent,
  title,
  subtitle,
  titleId,
  subtitleId,
  expiresAt,
  openedAt,
  acceptedAt,
  onExpire,
  onClose,
}: ActiveFlagHeaderProps) => {
  const {color, tint, ink, edge} = accent;

  const hasTimers = Boolean(openedAt || expiresAt || acceptedAt);
  const hasActions = Boolean(hasTimers || onClose);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: {xs: 'wrap', sm: 'nowrap'},
        alignItems: 'center',
        flexShrink: 0,
        gap: 3.5,
        px: 5,
        py: 4.5,
        background: `radial-gradient(90% 160% at 0% 0%, ${alpha(
          edge,
          0.2
        )} 0%, ${alpha(edge, 0)} 65%), ${tint}`,
        borderBottom: '1px solid',
        borderColor: alpha(edge, 0.24),
      }}
    >
      <SeverityIconTile accent={accent} />

      <Box sx={{flex: 1, minWidth: 0}}>
        <Typography
          id={titleId}
          component='h2'
          sx={{
            color: ink,
            fontSize: 19,
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            textWrap: 'balance',
          }}
        >
          {title}
        </Typography>
        <Typography
          id={subtitleId}
          sx={{color: 'text.secondary', fontSize: 13, fontWeight: 500}}
        >
          {subtitle}
        </Typography>
      </Box>

      {hasActions && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexShrink: 0,
            ml: 'auto',
          }}
        >
          {hasTimers && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 1.5,
              }}
            >
              {acceptedAt && (
                <AcceptedPill
                  since={openedAt}
                  acceptedAt={acceptedAt}
                  accentColor={color}
                />
              )}
              {openedAt && !acceptedAt && (
                <OpenForPill since={openedAt} accentColor={color} />
              )}
              {expiresAt && !acceptedAt && (
                <ExpiryCountdown
                  expiresAt={expiresAt}
                  accentColor={color}
                  onExpire={onExpire}
                />
              )}
            </Box>
          )}
          {onClose && <DialogCloseButton onClick={onClose} className='-mr-2' />}
        </Box>
      )}
    </Box>
  );
};

export default ActiveFlagHeader;
