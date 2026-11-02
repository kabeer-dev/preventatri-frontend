import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import {
  CHECKLIST_SUBMISSION_STATUS,
  getSubmissionStatusConfig,
  SUBMISSION_DATE_TIME_FORMAT,
} from '@/shared/constants/assessmentChecklists';
import {DETAIL_EMPTY_VALUE} from '@/shared/constants/common';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {Submission} from '@/shared/interfaces/submission';
import {formatDate} from '@/shared/utils/dateUtils';
import {
  formatSubmissionDay,
  getSubmissionLateLabel,
  getSubmissionScheduleLabel,
} from '@/shared/utils/submissionUtils';

// "20 Oct 2026" over the window end, or how late it is.
export const DueCell = ({row}: {row: Submission}) => {
  const {t} = useTranslation();
  const lateLabel = getSubmissionLateLabel({lateDays: row.lateDays, t});
  const isOpenAndLate = row.status === CHECKLIST_SUBMISSION_STATUS.LATE.value;
  const isMissed = row.status === CHECKLIST_SUBMISSION_STATUS.MISSED.value;
  const deadline = formatSubmissionDay({date: row.deadline});

  const windowLabel = isMissed
    ? t('submissions.due.windowClosed', {deadline})
    : t('submissions.due.windowUntil', {deadline});

  if (!row.dueDate)
    return (
      <Typography variant='body2' sx={{color: 'text.secondary'}}>
        {DETAIL_EMPTY_VALUE}
      </Typography>
    );

  return (
    <Box sx={{minWidth: 0}}>
      <Typography noWrap variant='body2'>
        {formatSubmissionDay({date: row.dueDate})}
      </Typography>
      <Typography
        noWrap
        variant='small'
        sx={{
          color: isOpenAndLate ? 'error.main' : 'text.disabled',
          fontWeight: isOpenAndLate ? 600 : 400,
        }}
      >
        {lateLabel || (row.deadline ? windowLabel : DETAIL_EMPTY_VALUE)}
      </Typography>
    </Box>
  );
};

// The checklist schedule this row came from and who set it up.
export const ScheduleCell = ({row}: {row: Submission}) => {
  const {t} = useTranslation();
  const schedule = getSubmissionScheduleLabel({type: row.scheduleType, t});

  return (
    <Box sx={{minWidth: 0}}>
      <Typography noWrap variant='body2'>
        {schedule || DETAIL_EMPTY_VALUE}
      </Typography>
      {row.assignedByName && (
        <Typography noWrap variant='small' sx={{color: 'text.disabled'}}>
          {t('submissions.schedule.assignedBy', {name: row.assignedByName})}
        </Typography>
      )}
    </Box>
  );
};

// A timestamp in the organization's time zone.
export const OrgDateCell = ({
  date,
  format,
}: {
  date: string | null;
  format: string;
}) => {
  const {zone} = useOrganizationTimeZone();

  return (
    <Typography noWrap variant='body' sx={{color: 'text.secondary'}}>
      {date ? formatDate({date, format, zone}) : DETAIL_EMPTY_VALUE}
    </Typography>
  );
};

// The status chip, with the voided date under it for voided rows.
export const StatusCell = ({
  row,
  showVoidedAt,
}: {
  row: Submission;
  showVoidedAt: boolean;
}) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const {label, color} = getSubmissionStatusConfig({status: row.status, t});

  return (
    <Box
      sx={{
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 0.5,
      }}
    >
      <CustomChip label={label} color={color} />
      {showVoidedAt && row.voidedAt && (
        <Typography noWrap variant='small' sx={{color: 'text.disabled'}}>
          {formatDate({
            date: row.voidedAt,
            format: SUBMISSION_DATE_TIME_FORMAT,
            zone,
          })}
        </Typography>
      )}
    </Box>
  );
};
