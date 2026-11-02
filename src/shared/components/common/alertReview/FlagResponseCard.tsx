'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CustomChip from '@/@core/components/mui/chip';
import AlertReviewCard from '@/shared/components/common/alertReview/AlertReviewCard';
import ResolutionBlock from '@/shared/components/common/alertReview/ResolutionBlock';
import ResolutionScheduledItem from '@/shared/components/common/alertReview/ResolutionScheduledItem';
import AttachmentGallery from '@/shared/components/common/AttachmentGallery';
import {ALERT_REVIEW_QUOTE_SX} from '@/shared/constants/alertReview';
import {
  ACTION_TAKEN_CHECKBOXES,
  TIMELINE_TIMESTAMP_FORMAT,
} from '@/shared/constants/flag';
import useTranslation from '@/shared/hooks/useTranslation';
import {FlagResponseCardProps} from '@/shared/interfaces/flag';
import {formatDate} from '@/shared/utils/dateUtils';
import {getFullName} from '@/shared/utils/general';

const FlagResponseCard = ({response}: FlagResponseCardProps) => {
  const {t} = useTranslation();

  const actionLabels = response.actions.map((code) => {
    const match = ACTION_TAKEN_CHECKBOXES.find(({value}) => value === code);

    return match ? t(match.labelKey) : String(code);
  });

  const submitterName = getFullName({
    firstName: response.submitter?.firstName,
    lastName: response.submitter?.lastName,
  });

  const followUpDate = response.followUpDate
    ? formatDate({
        date: response.followUpDate,
        format: TIMELINE_TIMESTAMP_FORMAT,
      })
    : '';

  const supervisoryVisitDate = response.supervisoryVisitDate
    ? formatDate({
        date: response.supervisoryVisitDate,
        format: TIMELINE_TIMESTAMP_FORMAT,
      })
    : '';

  return (
    <AlertReviewCard
      title={t('alertReview.resolution.title')}
      action={
        <CustomChip
          skin='light'
          size='small'
          color='success'
          label={formatDate({
            date: response.createdAt,
            format: TIMELINE_TIMESTAMP_FORMAT,
          })}
        />
      }
    >
      {actionLabels.length > 0 && (
        <ResolutionBlock label={t('alertReview.resolution.actionsTaken')}>
          <Box
            component='ul'
            sx={{m: 0, p: 0, listStyle: 'none', display: 'grid', gap: 2}}
          >
            {actionLabels.map((label) => (
              <Box
                component='li'
                key={label}
                sx={{display: 'flex', alignItems: 'center', gap: 2.5}}
              >
                <Box
                  component='span'
                  sx={{display: 'flex', color: 'success.main'}}
                >
                  <Icon icon='mdi:check-circle-outline' fontSize={18} />
                </Box>
                <Typography variant='bodyStrong'>{label}</Typography>
              </Box>
            ))}
          </Box>
        </ResolutionBlock>
      )}

      {response.notes && (
        <ResolutionBlock label={t('alertReview.resolution.notes')}>
          <Typography
            variant='body'
            component='p'
            sx={{...ALERT_REVIEW_QUOTE_SX, m: 0}}
          >
            {response.notes}
          </Typography>
        </ResolutionBlock>
      )}

      {response.attachments.length > 0 && (
        <ResolutionBlock
          label={t('alertReview.resolution.attachments')}
          icon='mdi:paperclip'
        >
          <AttachmentGallery attachments={response.attachments} />
        </ResolutionBlock>
      )}

      {response.hasFollowUp && (
        <ResolutionScheduledItem
          icon='mdi:calendar-clock-outline'
          title={t('alertReview.resolution.followUp')}
          facts={[
            {
              label: t('alertReview.resolution.date'),
              value: followUpDate,
            },
            {
              label: t('alertReview.resolution.task'),
              value: response.followUpDescription || '',
            },
          ].filter(({value}) => Boolean(value))}
        />
      )}

      {response.hasSupervisoryVisit && (
        <ResolutionScheduledItem
          icon='mdi:account-eye-outline'
          title={t('alertReview.resolution.supervisoryVisit')}
          facts={[
            {
              label: t('alertReview.resolution.date'),
              value: supervisoryVisitDate,
            },
            {
              label: t('alertReview.resolution.instructions'),
              value: response.supervisoryInstructions || '',
            },
          ].filter(({value}) => Boolean(value))}
        />
      )}

      {submitterName && (
        <ResolutionBlock label={t('alertReview.resolution.submittedBy')}>
          <Typography variant='bodyStrong'>{submitterName}</Typography>
        </ResolutionBlock>
      )}
    </AlertReviewCard>
  );
};

export default FlagResponseCard;
