'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import CustomChip from '@/@core/components/mui/chip';
import ConfigChip from '@/shared/components/common/chips/ConfigChip';
import RecordHeading from '@/shared/components/common/headers/RecordHeading';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {SupervisoryVisitDetailsUIProps} from '@/shared/interfaces/supervisoryVisit';
import {getFullName} from '@/shared/utils/general';
import {
  formatScheduleRange,
  getFilingCopyKeys,
  getVisitLateMinutes,
  getVisitStatusConfig,
  getVisitTypeConfig,
  getVisitTypeLabel,
} from '@/shared/utils/supervisoryVisitUtils';
import {formatDurationLabel} from '@/shared/utils/workItemUtils';

const SupervisoryVisitDetailsHeader = ({
  visit,
  permissions,
  actions,
}: SupervisoryVisitDetailsUIProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const {isAdmin} = useUserRole();
  const status = getVisitStatusConfig({status: visit.status});

  // "Overdue 6h" beats the plain status word while the visit is late.
  const statusChip =
    visit.isOverdue && status ? (
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
    ) : (
      <ConfigChip config={status} fallbackLabel={visit.status} />
    );

  const patientName = getFullName({
    firstName: visit.patient?.firstName,
    lastName: visit.patient?.lastName,
    lastFirst: true,
  });

  return (
    <>
      <TopBarSlot side='left'>
        <RecordHeading
          crumb={t('supervisoryVisits.detail.crumb')}
          crumbHref={DASHBOARD_ROUTES.supervisoryVisits.all()}
          name={t('supervisoryVisits.detail.heading', {patient: patientName})}
          identityLine={formatScheduleRange({visit, zone})}
          status={
            <Box className='flex items-center gap-2'>
              {statusChip}
              <ConfigChip
                config={getVisitTypeConfig({visitType: visit.visitType})}
                fallbackLabel={getVisitTypeLabel({visit, t})}
              />
            </Box>
          }
        />
      </TopBarSlot>

      <TopBarSlot side='right'>
        <Box className='flex items-center gap-2'>
          {permissions.canAddFollowUp && (
            <Button variant='text' onClick={actions.onAddFollowUp}>
              {t('supervisoryVisits.actions.addFollowUp')}
            </Button>
          )}
          {permissions.canEdit && (
            <Button variant='outlined' onClick={actions.onEdit}>
              {t('supervisoryVisits.actions.edit')}
            </Button>
          )}
          {permissions.canCancel && (
            <Button variant='outlined' color='error' onClick={actions.onCancel}>
              {t('supervisoryVisits.actions.cancel')}
            </Button>
          )}
          {permissions.canReview && (
            <Button variant='outlined' onClick={actions.onRequestCorrection}>
              {t('supervisoryVisits.actions.requestCorrection')}
            </Button>
          )}
          {permissions.canReview && (
            <Button variant='contained' onClick={actions.onApprove}>
              {t('supervisoryVisits.actions.approve')}
            </Button>
          )}
          {permissions.canFile && (
            <Button variant='contained' onClick={actions.onFile}>
              {t(getFilingCopyKeys({isAdmin}).action)}
            </Button>
          )}
          {/* PREVENT-772: reopen removed for now; uncomment to restore.
          {permissions.canReopen && (
            <Button variant='outlined' onClick={actions.onReopen}>
              {t('supervisoryVisits.actions.reopen')}
            </Button>
          )} */}
        </Box>
      </TopBarSlot>
    </>
  );
};

export default SupervisoryVisitDetailsHeader;
