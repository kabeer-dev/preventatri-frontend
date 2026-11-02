'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import AttachmentGallery from '@/shared/components/common/AttachmentGallery';
import {FOLLOW_UP_TASK_STATUS} from '@/shared/constants/followUps';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpTaskCardProps} from '@/shared/interfaces/followUp';
import {
  formatDurationLabel,
  getLateMinutes,
  getOutcomeConfig,
  getPersonName,
} from '@/shared/utils/followUpUtils';

const SectionLabel = ({children}: {children: string}) => (
  <Typography
    variant='caption'
    className='mb-2 block font-bold uppercase'
    sx={{color: 'text.secondary', letterSpacing: 0.6}}
  >
    {children}
  </Typography>
);

// What the task asks for; once completed, also how it went.
const FollowUpDescriptionCard = ({task}: FollowUpTaskCardProps) => {
  const {t} = useTranslation();
  const isCompleted = task.status === FOLLOW_UP_TASK_STATUS.COMPLETED.value;
  const outcome = getOutcomeConfig({outcome: task.completionOutcome});
  const lateMinutes = getLateMinutes({task});

  return (
    <Card elevation={6}>
      <CardContent className='px-3 py-6 md:px-4'>
        {isCompleted && outcome && (
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
                {t(
                  lateMinutes > 0
                    ? 'followUps.due.completedLate'
                    : 'followUps.due.completedEarly',
                  {duration: formatDurationLabel({minutes: lateMinutes, t})}
                )}{' '}
                · {getPersonName({person: task.completedByUser})}
              </Typography>
            </Box>
          </Box>
        )}

        <Typography variant='h6' className='mb-3 font-bold'>
          {t('followUps.detail.description')}
        </Typography>
        <Typography
          variant='body2'
          className='whitespace-pre-wrap'
          sx={{color: task.description ? 'text.primary' : 'text.disabled'}}
        >
          {task.description || t('followUps.detail.noDescription')}
        </Typography>

        {task.visitInstructions && (
          <Box className='mt-4 rounded p-3' sx={{bgcolor: 'action.hover'}}>
            <Typography
              variant='small'
              sx={{display: 'block', color: 'text.secondary', mb: 0.5}}
            >
              {t('followUps.detail.creatorNote', {
                name: getPersonName({person: task.createdByUser}),
              })}
            </Typography>
            <Typography variant='body2' className='whitespace-pre-wrap'>
              {task.visitInstructions}
            </Typography>
          </Box>
        )}

        {isCompleted && task.completionNotes && (
          <Box className='mt-5'>
            <SectionLabel>{t('followUps.detail.completionNotes')}</SectionLabel>
            <Typography variant='body2' className='whitespace-pre-wrap'>
              {task.completionNotes}
            </Typography>
          </Box>
        )}

        {isCompleted && task.completionFiles.length > 0 && (
          <Box className='mt-5'>
            <SectionLabel>{t('followUps.detail.evidence')}</SectionLabel>
            <AttachmentGallery attachments={task.completionFiles} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowUpDescriptionCard;
