import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import AttachmentGallery, {
  AttachmentItem,
} from '@/shared/components/common/AttachmentGallery';
import useTranslation from '@/shared/hooks/useTranslation';

import AnswerValue from './AnswerValue';

interface QuestionAnswerItemProps {
  questionTitle?: string;
  type?: string;
  value: unknown;
  comment?: string | null;
  attachments?: AttachmentItem[];
}

// Shared renderer for a single question + its answer (value, optional comment
// and attachments). Reused by the submission section card and the auto-flag
// submission accordion so the layout stays in one place.
const QuestionAnswerItem = ({
  questionTitle,
  type,
  value,
  comment,
  attachments,
}: QuestionAnswerItemProps) => {
  const {t} = useTranslation();

  return (
    <div>
      <Typography
        variant='body2'
        className='block font-medium mb-2'
        sx={{
          color: 'text.secondary',
          lineHeight: 1.5,
        }}
      >
        {questionTitle}
      </Typography>

      <AnswerValue value={value} type={type} />

      {comment && (
        <Box className='mt-4 pl-4 border-l-2' sx={{borderColor: 'divider'}}>
          <Typography
            variant='caption'
            className='block font-bold uppercase mb-1'
            sx={{
              color: 'text.disabled',
              letterSpacing: 0.6,
            }}
          >
            {t('submissions.detail.extraNote')}
          </Typography>
          <Typography
            variant='body2'
            className='whitespace-pre-wrap'
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
            }}
          >
            {comment}
          </Typography>
        </Box>
      )}

      {attachments && attachments.length > 0 && (
        <div className='mt-4'>
          <Typography
            variant='caption'
            className='block font-bold uppercase mb-2'
            sx={{
              color: 'text.disabled',
              letterSpacing: 0.6,
            }}
          >
            {t('submissions.detail.attachments')}
          </Typography>
          <AttachmentGallery attachments={attachments} thumbnailSize={104} />
        </div>
      )}
    </div>
  );
};

export default QuestionAnswerItem;
