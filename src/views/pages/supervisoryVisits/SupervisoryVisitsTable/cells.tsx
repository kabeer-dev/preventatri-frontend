'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import ConfigChip from '@/shared/components/common/chips/ConfigChip';
import {UserGridCell} from '@/shared/components/common/table/UserGridCell';
import {
  SUPERVISORY_VISIT_STATUS,
  SUPERVISORY_VISIT_TYPE,
} from '@/shared/constants/supervisoryVisits';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {SupervisoryVisit} from '@/shared/interfaces/supervisoryVisit';
import {getFullName} from '@/shared/utils/general';
import {
  formatScheduleDate,
  formatScheduleWindow,
  getScheduleRelativeLabel,
  getVisitLateMinutes,
  getVisitStatusConfig,
  getVisitTypeConfig,
  getVisitTypeLabel,
} from '@/shared/utils/supervisoryVisitUtils';
import {formatDurationLabel, getRoleLabel} from '@/shared/utils/workItemUtils';

const Dash = () => (
  <Typography variant='body2' sx={{color: 'text.disabled'}}>
    N/A
  </Typography>
);

// Patient with the reason underneath.
export const PatientCell = ({visit}: {visit: SupervisoryVisit}) => (
  <Box sx={{minWidth: 0}}>
    <Typography noWrap variant='bodyStrong' sx={{display: 'block'}}>
      {getFullName({
        firstName: visit.patient?.firstName,
        lastName: visit.patient?.lastName,
        lastFirst: true,
      })}
    </Typography>
    {visit.description && (
      <Typography noWrap variant='small' sx={{color: 'text.disabled'}}>
        {visit.description}
      </Typography>
    )}
  </Box>
);

// An OTHER visit shows what the scheduler typed, not the generic word.
export const VisitTypeCell = ({visit}: {visit: SupervisoryVisit}) => {
  const {t} = useTranslation();
  const isOther = visit.visitType === SUPERVISORY_VISIT_TYPE.OTHER.value;

  return (
    <ConfigChip
      config={isOther ? null : getVisitTypeConfig({visitType: visit.visitType})}
      fallbackLabel={getVisitTypeLabel({visit, t})}
    />
  );
};

export const AssigneeCell = ({visit}: {visit: SupervisoryVisit}) => {
  const user = visit.assignee?.user;

  if (!user) return <Dash />;

  return (
    <UserGridCell
      firstName={user.firstName ?? ''}
      lastName={user.lastName ?? ''}
      meta={getRoleLabel({role: visit.assignee?.role})}
    />
  );
};

// "21 Aug 2026 · 09:00–10:30" with the relative line, red once late.
export const ScheduleCell = ({visit}: {visit: SupervisoryVisit}) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();

  const isOpen =
    visit.status === SUPERVISORY_VISIT_STATUS.SCHEDULED.value ||
    visit.status === SUPERVISORY_VISIT_STATUS.OVERDUE.value;

  const isLate =
    isOpen && (visit.isOverdue || getVisitLateMinutes({visit}) > 0);

  return (
    <Box sx={{minWidth: 0}}>
      <Typography noWrap variant='body2'>
        {formatScheduleDate({value: visit.scheduledStartAt, zone})} ·{' '}
        {formatScheduleWindow({visit, zone})}
      </Typography>
      <Typography
        noWrap
        variant='small'
        sx={{
          color: isLate ? 'error.main' : 'text.disabled',
          fontWeight: isLate ? 600 : 400,
        }}
      >
        {getScheduleRelativeLabel({visit, t, zone})}
      </Typography>
    </Box>
  );
};

export const CaregiversCell = ({visit}: {visit: SupervisoryVisit}) => {
  const {t} = useTranslation();
  const count = visit.caregiversCount ?? visit.caregivers?.length ?? 0;

  if (!count) return <Dash />;

  return (
    <Typography variant='body2'>
      {t('supervisoryVisits.table.caregiversCount', {count})}
    </Typography>
  );
};

// "Overdue 6h" beats the plain status word while the visit is late.
export const StatusCell = ({visit}: {visit: SupervisoryVisit}) => {
  const {t} = useTranslation();
  const status = getVisitStatusConfig({status: visit.status});

  if (visit.isOverdue && status)
    return (
      <CustomChip
        skin='light'
        size='small'
        color='error'
        label={t('followUps.due.overdueBy', {
          duration: formatDurationLabel({
            minutes: getVisitLateMinutes({visit}),
            t,
          }),
        })}
      />
    );

  return <ConfigChip config={status} fallbackLabel={visit.status} />;
};
