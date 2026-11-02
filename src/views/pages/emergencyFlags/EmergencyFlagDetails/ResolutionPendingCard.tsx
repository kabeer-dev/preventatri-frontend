'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CustomAvatar from '@/@core/components/mui/avatar';
import CustomChip from '@/@core/components/mui/chip';
import {radius} from '@/@core/theme/spacing';
import {getInitials} from '@/@core/utils/userUtils';
import AlertReviewCard from '@/shared/components/common/alertReview/AlertReviewCard';
import {ALERT_REVIEW_SIZES} from '@/shared/constants/alertReview';
import {TIMELINE_TIME_FORMAT} from '@/shared/constants/flag';
import useTranslation from '@/shared/hooks/useTranslation';
import {ResolutionPendingCardProps} from '@/shared/interfaces/alertReview';
import {formatDate} from '@/shared/utils/dateUtils';
import {getFullName} from '@/shared/utils/general';

const ResolutionPendingCard = ({
  currentAssignee,
  acceptedAt,
  acceptedBy,
  onAccept,
  isAccepting = false,
}: ResolutionPendingCardProps) => {
  const {t} = useTranslation();

  const assigneeName = getFullName({
    firstName: currentAssignee?.firstName,
    lastName: currentAssignee?.lastName,
  });

  return (
    <AlertReviewCard
      title={t('alertReview.resolution.title')}
      action={
        <CustomChip
          skin='light'
          size='small'
          color={acceptedAt ? 'info' : 'secondary'}
          label={
            acceptedAt
              ? t('alertReview.resolution.accepted')
              : t('alertReview.resolution.notResolved')
          }
        />
      }
    >
      <Box sx={{px: 4.5, pb: 4.5}}>
        {currentAssignee && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              p: 3,
              mb: 3,
              borderRadius: `${radius.sm}px`,
              border: '1px solid',
              borderColor: 'customColors.ruleStrong',
              backgroundColor: 'customColors.surfaceRaised',
            }}
          >
            <CustomAvatar
              skin='light'
              color='primary'
              sx={{
                width: ALERT_REVIEW_SIZES.avatar,
                height: ALERT_REVIEW_SIZES.avatar,
                fontSize: 12.5,
                flex: 'none',
              }}
            >
              {getInitials({name: assigneeName})}
            </CustomAvatar>
            <Box sx={{minWidth: 0}}>
              <Typography noWrap variant='bodyStrong' component='div'>
                {assigneeName ||
                  t('emergencyFlags.detail.escalation.unassigned')}
              </Typography>
              <Typography
                variant='small'
                component='div'
                sx={{color: 'text.secondary'}}
              >
                {t('alertReview.resolution.assignedAt', {
                  level: t(
                    `emergencyFlags.detail.escalation.levels.${currentAssignee.level}`
                  ),
                  time: formatDate({
                    date: currentAssignee.assignedAt,
                    format: TIMELINE_TIME_FORMAT,
                  }),
                })}
              </Typography>
            </Box>
          </Box>
        )}

        {acceptedAt && (
          <Typography
            variant='small'
            component='p'
            sx={{m: 0, mb: 2, color: 'info.main', fontWeight: 600}}
          >
            {t('alertReview.resolution.acceptedBy', {
              name: getFullName({
                firstName: acceptedBy?.firstName,
                lastName: acceptedBy?.lastName,
              }),
              time: formatDate({
                date: acceptedAt,
                format: TIMELINE_TIME_FORMAT,
              }),
            })}
          </Typography>
        )}

        <Typography
          variant='small'
          component='p'
          sx={{m: 0, color: 'customColors.inkSoft'}}
        >
          {onAccept
            ? t('alertReview.resolution.acceptHint')
            : t('alertReview.resolution.pendingHint')}
        </Typography>

        {onAccept && (
          <Button
            variant='contained'
            color='info'
            onClick={onAccept}
            disabled={isAccepting}
            startIcon={<Icon icon='mdi:account-check-outline' fontSize={18} />}
            sx={{mt: 3}}
          >
            {isAccepting
              ? t('flag.activeModal.accepting')
              : t('alertReview.resolution.accept')}
          </Button>
        )}
      </Box>
    </AlertReviewCard>
  );
};

export default ResolutionPendingCard;
