'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import {ThemeColor} from '@/@core/theme/types';
import {thinScrollbarSx} from '@/shared/components/common/styles';
import {
  PATIENT_TIMELINE_COLORS,
  PATIENT_TIMELINE_DATE_COLUMN_WIDTH,
  PATIENT_TIMELINE_FLAG_COLORS,
  PATIENT_TIMELINE_FLAG_EVENT_TYPES,
  PATIENT_TIMELINE_MAX_HEIGHT,
  PATIENT_TIMELINE_SKELETON_ROWS,
} from '@/shared/constants/patients';
import useInfiniteScrollSentinel from '@/shared/hooks/useInfiniteScrollSentinel';
import useTranslation from '@/shared/hooks/useTranslation';
import {PatientTimelineEntry} from '@/shared/interfaces/patient';
import {PatientTimelineCardProps} from '@/shared/interfaces/patientDetails';
import {patientQueries} from '@/shared/reactQuery';
import {formatDate} from '@/shared/utils/dateUtils';
import {getFullName} from '@/shared/utils/general';

const TimelineSkeletonRows = () => (
  <>
    {Array.from({length: PATIENT_TIMELINE_SKELETON_ROWS}).map((_, index) => (
      <Box key={index} className='flex items-start gap-3 py-2.5'>
        <Skeleton variant='text' width={PATIENT_TIMELINE_DATE_COLUMN_WIDTH} />
        <Box className='min-w-0 flex-1'>
          <Skeleton variant='text' width='60%' />
          <Skeleton variant='text' width='40%' />
        </Box>
      </Box>
    ))}
  </>
);

// Everything that has happened on this patient, newest first: assignments,
// flags, follow-ups, visits and edits, each with who did it and any note. The
// API pages it, so the next page is read as the list is scrolled to its end.
const PatientTimelineCard = ({patientId}: PatientTimelineCardProps) => {
  const {t} = useTranslation();

  const {useFetchPatientTimeline} = patientQueries();

  const {rows, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage} =
    useFetchPatientTimeline({id: patientId});

  // The list scrolls inside the card, so the card's own box is what the
  // sentinel at the end of the list is watched against.
  const [scrollNode, setScrollNode] = useState<HTMLDivElement | null>(null);

  const setSentinelNode = useInfiniteScrollSentinel({
    root: scrollNode,
    enabled: Boolean(scrollNode),
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const entries = rows.map((entry: PatientTimelineEntry, index: number) => {
    const isFlagEvent =
      PATIENT_TIMELINE_FLAG_EVENT_TYPES.includes(entry.type) && entry.flag;

    const color: ThemeColor = isFlagEvent
      ? PATIENT_TIMELINE_FLAG_COLORS[entry.flag as string] || 'secondary'
      : PATIENT_TIMELINE_COLORS[entry.type] || 'secondary';

    const label = isFlagEvent
      ? t(`patients.details.timeline.flags.${entry.type}.${entry.flag}`, {
          defaultValue: entry.type,
        })
      : t(`patients.details.timeline.events.${entry.type}`, {
          defaultValue: entry.type,
        });

    const userName = entry.user
      ? getFullName({
          firstName: entry.user.firstName,
          lastName: entry.user.lastName,
        })
      : '';

    const who = userName || t('patients.details.timeline.system');

    return {
      id: `${entry.type}-${entry.refId}-${entry.at}-${index}`,
      date: formatDate({date: entry.at, format: 'dd MMM'}),
      who,
      meta: [who, formatDate({date: entry.at, format: 'hh:mm a'})].join(' · '),
      label,
      color,
      notes: entry.notes,
    };
  });

  return (
    <Card>
      <CardContent className='flex flex-col gap-1'>
        <Typography
          variant='eyebrow'
          component='h2'
          sx={{color: 'text.disabled'}}
        >
          {t('patients.details.timeline.title')}
        </Typography>

        {!isLoading && entries.length === 0 && (
          <Typography variant='small' sx={{color: 'text.disabled', mt: 1.5}}>
            {t('patients.details.timeline.emptyMessage')}
          </Typography>
        )}

        <Box
          ref={setScrollNode}
          sx={[
            // Pulls the scrollbar into the card's padding so it never touches the rows.
            {
              maxHeight: PATIENT_TIMELINE_MAX_HEIGHT,
              overflowY: 'auto',
              mr: -2,
              pr: 2,
            },
            thinScrollbarSx,
          ]}
        >
          {isLoading && <TimelineSkeletonRows />}

          {entries.map(({id, date, who, meta, label, color, notes}) => (
            <Box
              key={id}
              className='flex items-start gap-3 py-2.5'
              sx={{borderBottom: '1px solid', borderColor: 'divider'}}
            >
              <Typography
                variant='mono'
                sx={{
                  color: 'text.secondary',
                  flex: 'none',
                  width: PATIENT_TIMELINE_DATE_COLUMN_WIDTH,
                }}
              >
                {date}
              </Typography>

              <Box className='min-w-0 flex-1'>
                <Typography
                  variant='small'
                  component='div'
                  sx={{fontWeight: 600, color: `${color}.main`}}
                >
                  {label}
                </Typography>
                <Tooltip title={who} placement='bottom-start'>
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
            </Box>
          ))}

          {isFetchingNextPage && <TimelineSkeletonRows />}

          {hasNextPage && <div ref={setSentinelNode} style={{height: 1}} />}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PatientTimelineCard;
