'use client';

import MuiTimeline, {TimelineProps} from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot, {TimelineDotProps} from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import {alpha, styled, Theme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import CustomAvatar from '@/@core/components/mui/avatar';
import CustomChip from '@/@core/components/mui/chip';
import {ThemeColor} from '@/@core/layouts/types';
import {getInitials} from '@/@core/utils/userUtils';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  ActivityDetail,
  ActivityLogEntry,
  ActivityTimelineProps,
} from '@/shared/interfaces/activityTimeline';

// Palette keys an entry's dotColor can safely resolve to; anything else
// (e.g. 'inherit') falls back to the neutral grey used for the dot.
const VALID_PALETTE_COLORS = [
  'primary',
  'secondary',
  'error',
  'info',
  'success',
  'warning',
] as const;

// Resolve an entry's ThemeColor to a concrete palette hue so the dot glow and
// the detail card's accent border read with the same color as the action chip.
const resolveAccentColor = ({
  theme,
  color,
}: {
  theme: Theme;
  color?: ThemeColor;
}): string => {
  const colorKey = color as (typeof VALID_PALETTE_COLORS)[number];

  return VALID_PALETTE_COLORS.includes(colorKey)
    ? theme.palette[colorKey].main
    : theme.palette.grey[400];
};

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>(({theme}) => ({
  margin: 0,
  padding: 0,
  marginLeft: theme.spacing(0.75),
  '& .MuiTimelineItem-root': {
    '&:before': {display: 'none'},
    '&:last-child': {minHeight: 60},
  },
  '& .MuiTimelineConnector-root': {
    width: 2,
    backgroundColor: theme.palette.divider,
  },
}));

// Styled TimelineDot with larger, lighter background circle
const StyledTimelineDot = styled(TimelineDot)<TimelineDotProps>(({
  theme,
  color,
}) => {
  const dotColor = resolveAccentColor({theme, color: color as ThemeColor});

  return {
    margin: 0,
    borderWidth: 3,
    boxShadow: `0 0 0 4px ${alpha(dotColor, 0.16)}`,
  };
});

/**
 * Generic Activity Timeline component
 * Displays activity logs with timestamps and user avatars
 * Reusable across different pages (patients, caregivers, etc.)
 */
export default function ActivityTimeline({
  title,
  entries,
  emptyMessage,
}: ActivityTimelineProps) {
  const {t} = useTranslation();

  const displayEmptyMessage =
    emptyMessage || t('activityTimeline.emptyMessage');

  return (
    <Card>
      <CardHeader
        title={title}
        slotProps={{
          title: {variant: 'h6', sx: {fontWeight: 600}},
        }}
      />
      <CardContent>
        {entries.length === 0 ? (
          <Typography
            variant='body2'
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              py: 4,
            }}
          >
            {displayEmptyMessage}
          </Typography>
        ) : (
          <Timeline sx={{gap: 3}}>
            {entries.map((entry: ActivityLogEntry, index: number) => (
              <TimelineItem key={entry.id}>
                <TimelineSeparator>
                  <StyledTimelineDot
                    variant='outlined'
                    color={entry.dotColor}
                  />
                  {index < entries.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent
                  sx={{
                    pb: 0,
                    transition: 'transform 0.2s ease',
                    '&:hover': {transform: 'translateX(2px)'},
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      gap: 1,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant='body2'
                      sx={{fontWeight: 600, color: 'text.primary'}}
                    >
                      {entry.title}
                    </Typography>
                    <CustomChip
                      rounded
                      skin='light'
                      size='small'
                      color={entry.dotColor}
                      label={entry.timestamp}
                    />
                  </Box>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    {entry.users.map((user, userIndex) => (
                      <Box
                        key={userIndex}
                        sx={{display: 'flex', alignItems: 'center'}}
                      >
                        {user.avatar ? (
                          <CustomAvatar
                            src={user.avatar}
                            alt={user.name}
                            sx={{width: 32, height: 32, mr: 1}}
                          />
                        ) : (
                          <CustomAvatar
                            skin='light'
                            color={user.avatarColor || 'primary'}
                            sx={{
                              width: 32,
                              height: 32,
                              mr: 1,
                              fontSize: '0.75rem',
                            }}
                          >
                            {getInitials({name: user.name})}
                          </CustomAvatar>
                        )}
                        <Typography
                          variant='body2'
                          sx={{
                            color: 'text.secondary',
                          }}
                        >
                          {user.role
                            ? `${user.name} (${user.role})`
                            : user.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  {entry.details && entry.details.length > 0 && (
                    <Box
                      sx={(theme: Theme) => ({
                        mt: 2,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        borderRadius: 1,
                        bgcolor: 'action.hover',
                        borderLeft: `3px solid ${alpha(
                          resolveAccentColor({theme, color: entry.dotColor}),
                          0.5
                        )}`,
                      })}
                    >
                      {entry.details.map((detail: ActivityDetail) => (
                        <Box
                          key={detail.label}
                          sx={{display: 'flex', alignItems: 'baseline', gap: 2}}
                        >
                          <Typography
                            variant='caption'
                            sx={{
                              color: 'text.secondary',
                              minWidth: 72,
                              fontWeight: 500,
                            }}
                          >
                            {detail.label}
                          </Typography>
                          <Typography
                            variant='caption'
                            sx={{
                              color: 'text.primary',
                            }}
                          >
                            {detail.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </CardContent>
    </Card>
  );
}
