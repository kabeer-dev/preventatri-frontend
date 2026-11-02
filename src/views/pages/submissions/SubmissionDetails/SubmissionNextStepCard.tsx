'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import AlertReviewCard from '@/shared/components/common/alertReview/AlertReviewCard';
import useTranslation from '@/shared/hooks/useTranslation';
import {SubmissionNextStepCardProps} from '@/shared/interfaces/submission';
import {getSubmissionGuidance} from '@/shared/utils/submissionUtils';

// What staff should do about a submission that is not on track.
const SubmissionNextStepCard = ({
  submission,
  permissions,
  onSkip,
  onVoid,
  onCreateFollowUp,
}: SubmissionNextStepCardProps) => {
  const {t} = useTranslation();
  const guidance = getSubmissionGuidance({submission, t});
  const {canSkip, canVoid, canCreateFollowUp} = permissions;
  const hasActions = canSkip || canVoid || canCreateFollowUp;

  if (!guidance && !hasActions) return null;

  return (
    <AlertReviewCard title={t('submissions.nextStep.title')}>
      <Box sx={{px: 4.5, pb: 4, display: 'grid', gap: 3}}>
        {guidance && (
          <Typography variant='body2' sx={{color: 'text.secondary'}}>
            {guidance}
          </Typography>
        )}
        {hasActions && (
          <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2}}>
            {canCreateFollowUp && (
              <Button variant='contained' onClick={onCreateFollowUp}>
                {t('submissions.actions.createFollowUp')}
              </Button>
            )}
            {canSkip && (
              <Button variant='outlined' onClick={onSkip}>
                {t('submissions.actions.skip')}
              </Button>
            )}
            {canVoid && (
              <Button variant='outlined' color='warning' onClick={onVoid}>
                {t('submissions.actions.void')}
              </Button>
            )}
          </Box>
        )}
      </Box>
    </AlertReviewCard>
  );
};

export default SubmissionNextStepCard;
