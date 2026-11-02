'use client';

import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import AlertReviewCard from '@/shared/components/common/alertReview/AlertReviewCard';
import ResolutionBlock from '@/shared/components/common/alertReview/ResolutionBlock';
import {ALERT_REVIEW_QUOTE_SX} from '@/shared/constants/alertReview';
import {TIMELINE_TIMESTAMP_FORMAT} from '@/shared/constants/flag';
import useTranslation from '@/shared/hooks/useTranslation';
import {VoidSummaryCardProps} from '@/shared/interfaces/alertReview';
import {formatDate} from '@/shared/utils/dateUtils';
import {getFullName} from '@/shared/utils/general';

const VoidSummaryCard = ({
  voidedAt,
  voidedBy,
  voidReason,
}: VoidSummaryCardProps) => {
  const {t} = useTranslation();

  const voidedByName = getFullName({
    firstName: voidedBy?.firstName,
    lastName: voidedBy?.lastName,
  });

  return (
    <AlertReviewCard
      title={t('alertReview.resolution.voided')}
      action={
        voidedAt && (
          <CustomChip
            skin='light'
            size='small'
            color='secondary'
            label={formatDate({
              date: voidedAt,
              format: TIMELINE_TIMESTAMP_FORMAT,
            })}
          />
        )
      }
    >
      {voidedByName && (
        <ResolutionBlock label={t('alertReview.resolution.voidedBy')}>
          <Typography variant='bodyStrong'>{voidedByName}</Typography>
        </ResolutionBlock>
      )}

      {voidReason && (
        <ResolutionBlock label={t('alertReview.resolution.voidReason')}>
          <Typography
            variant='body'
            component='p'
            sx={{
              ...ALERT_REVIEW_QUOTE_SX,
              m: 0,
              borderColor: 'customColors.severityModerateBar',
              backgroundColor: 'customColors.severityModerateBg',
            }}
          >
            {voidReason}
          </Typography>
        </ResolutionBlock>
      )}
    </AlertReviewCard>
  );
};

export default VoidSummaryCard;
