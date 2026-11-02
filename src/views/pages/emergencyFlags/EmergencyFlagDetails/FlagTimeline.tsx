'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import {
  ESCALATION_ACTION_COLORS,
  ESCALATION_FALLBACK_COLOR,
  TIMELINE_DATE_FORMAT,
  TIMELINE_TIME_FORMAT,
} from '@/shared/constants/flag';
import useTranslation from '@/shared/hooks/useTranslation';
import {FlagTimelineEntry, FlagTimelineProps} from '@/shared/interfaces/flag';
import {formatDate, getMillis} from '@/shared/utils/dateUtils';
import {getFullName} from '@/shared/utils/general';

// Width of the date gutter, sized for 'dd MMM' in the mono face so every entry
// starts on the same edge.
const DATE_COLUMN_WIDTH = 52;

// The alert's own history, one line per escalation step: when it moved, who it
// moved to, and what happened there.
const FlagTimeline = ({timeline}: FlagTimelineProps) => {
  const {t} = useTranslation();

  const orderedTimeline = Array.from(timeline).sort(
    (first: FlagTimelineEntry, second: FlagTimelineEntry) =>
      getMillis({date: first.at}) - getMillis({date: second.at})
  );

  const entries = orderedTimeline.map((entry: FlagTimelineEntry) => {
    const userName = entry.user
      ? getFullName({
          firstName: entry.user.firstName,
          lastName: entry.user.lastName,
        })
      : '';

    const action = t(`emergencyFlags.detail.escalation.actions.${entry.type}`, {
      defaultValue: entry.type,
    });

    const level = entry.level
      ? t(`emergencyFlags.detail.escalation.levels.${entry.level}`, {
          defaultValue: entry.level,
        })
      : '';

    return {
      id: `${entry.type}-${entry.at}`,
      date: formatDate({date: entry.at, format: TIMELINE_DATE_FORMAT}),
      title: userName || t('emergencyFlags.detail.escalation.unassigned'),
      meta: [level, formatDate({date: entry.at, format: TIMELINE_TIME_FORMAT})]
        .filter(Boolean)
        .join(' \u00b7 '),
      notes: entry.notes,
      action,
      color: ESCALATION_ACTION_COLORS[entry.type] || ESCALATION_FALLBACK_COLOR,
    };
  });

  return (
    <Card>
      <CardContent className='flex flex-col gap-1'>
        <Typography
          variant='eyebrow'
          component='h2'
          sx={{color: 'text.secondary'}}
        >
          {t('emergencyFlags.detail.escalation.title')}
        </Typography>

        {entries.length === 0 && (
          <Typography variant='small' sx={{color: 'text.secondary', mt: 1.5}}>
            {t('emergencyFlags.detail.escalation.emptyMessage')}
          </Typography>
        )}

        {entries.map(({id, date, title, meta, notes, action, color}) => (
          <Box
            key={id}
            className='flex items-start gap-3 py-2.5'
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-of-type': {borderBottom: 'none', pb: 0},
            }}
          >
            <Typography
              variant='mono'
              sx={{
                color: 'text.secondary',
                flex: 'none',
                width: DATE_COLUMN_WIDTH,
              }}
            >
              {date}
            </Typography>

            <Box className='min-w-0 flex-1'>
              <Tooltip title={title} placement='top-start'>
                <Typography noWrap variant='bodyStrong'>
                  {title}
                </Typography>
              </Tooltip>
              <Tooltip title={meta} placement='bottom-start'>
                <Typography
                  noWrap
                  variant='small'
                  sx={{color: 'text.secondary'}}
                >
                  {meta}
                </Typography>
              </Tooltip>
              {notes && (
                <Typography
                  variant='small'
                  component='p'
                  sx={{m: 0, mt: 0.5, wordBreak: 'break-word'}}
                >
                  {notes}
                </Typography>
              )}
            </Box>

            <Typography
              variant='small'
              sx={{fontWeight: 600, flex: 'none', color: `${color}.main`}}
            >
              {action}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default FlagTimeline;
