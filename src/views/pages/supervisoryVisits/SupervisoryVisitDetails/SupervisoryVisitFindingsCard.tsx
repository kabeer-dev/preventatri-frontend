'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import AttachmentGallery from '@/shared/components/common/AttachmentGallery';
import {
  SUPERVISORY_VISIT_EVENT_TYPES,
  SUPERVISORY_VISIT_STATUS,
} from '@/shared/constants/supervisoryVisits';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {SupervisoryVisitCardProps} from '@/shared/interfaces/supervisoryVisit';
import {
  getVisitLateMinutes,
  getVisitOutcomeConfig,
} from '@/shared/utils/supervisoryVisitUtils';
import {
  formatDurationLabel,
  formatHistoryTime,
  getPersonName,
} from '@/shared/utils/workItemUtils';

const SectionLabel = ({children}: {children: string}) => (
  <Typography
    variant='caption'
    className='mb-2 block font-bold uppercase'
    sx={{color: 'text.secondary', letterSpacing: 0.6}}
  >
    {children}
  </Typography>
);

// What the nurse found, once the visit was filed; stays visible while a
// correction is pending so the assignee sees what to fix.
const SupervisoryVisitFindingsCard = ({visit}: SupervisoryVisitCardProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const outcome = getVisitOutcomeConfig({outcome: visit.completionOutcome});

  if (!outcome && !visit.completionNotes) return null;

  const lateMinutes = getVisitLateMinutes({visit});
  const isApproved = visit.status === SUPERVISORY_VISIT_STATUS.APPROVED.value;

  // Events arrive newest first, so this is the latest send-back while the
  // findings wait to be corrected.
  const correction = visit.completedAt
    ? null
    : visit.events.find(
        (event) =>
          event.type ===
          SUPERVISORY_VISIT_EVENT_TYPES.CORRECTION_REQUESTED.value
      );

  const filingLine = visit.completedAt
    ? `${t(
        lateMinutes > 0
          ? 'supervisoryVisits.schedule.filedLate'
          : 'supervisoryVisits.schedule.filedOnTime',
        {duration: formatDurationLabel({minutes: lateMinutes, t})}
      )} · ${getPersonName({person: visit.completedByUser})}`
    : [
        t('supervisoryVisits.detail.awaitingCorrection'),
        getPersonName({person: correction?.actor}),
      ]
        .filter(Boolean)
        .join(' · ');

  const correctionReason = String(correction?.payload?.reason || '');

  return (
    <Card elevation={6}>
      <CardContent className='px-3 py-6 md:px-4'>
        {outcome && (
          <Box
            className='mb-5 flex items-start gap-3 rounded p-4'
            sx={{
              bgcolor: 'action.hover',
              borderLeft: 3,
              borderColor: `${outcome.color}.main`,
            }}
          >
            <Icon
              icon={outcome.icon}
              fontSize={22}
              color={`var(--mui-palette-${outcome.color}-main)`}
            />
            <Box>
              <Typography variant='bodyStrong'>
                {t(outcome.labelKey)}
              </Typography>
              <Typography
                variant='small'
                sx={{display: 'block', color: 'text.secondary'}}
              >
                {filingLine}
              </Typography>
              {correctionReason && (
                <Typography
                  variant='body2'
                  className='mt-1 whitespace-pre-wrap'
                  sx={{color: 'warning.main', fontWeight: 500}}
                >
                  {correctionReason}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {visit.completionNotes && (
          <Box>
            <SectionLabel>
              {t('supervisoryVisits.detail.findings')}
            </SectionLabel>
            <Typography variant='body2' className='whitespace-pre-wrap'>
              {visit.completionNotes}
            </Typography>
          </Box>
        )}

        {visit.completionFiles.length > 0 && (
          <Box className='mt-5'>
            <SectionLabel>
              {t('supervisoryVisits.detail.evidence')}
            </SectionLabel>
            <AttachmentGallery attachments={visit.completionFiles} />
          </Box>
        )}

        {isApproved && (
          <Box className='mt-5 rounded p-3' sx={{bgcolor: 'action.hover'}}>
            <SectionLabel>{t('supervisoryVisits.detail.review')}</SectionLabel>
            <Typography variant='body2'>
              {t('supervisoryVisits.detail.approvedBy', {
                name: getPersonName({person: visit.reviewedByUser}),
                date: visit.reviewedAt
                  ? formatHistoryTime({value: visit.reviewedAt, zone})
                  : '',
              })}
            </Typography>
            {visit.reviewNote && (
              <Typography
                variant='body2'
                className='mt-2 whitespace-pre-wrap'
                sx={{color: 'text.secondary'}}
              >
                {visit.reviewNote}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SupervisoryVisitFindingsCard;
