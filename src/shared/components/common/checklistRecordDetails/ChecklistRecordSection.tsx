import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useTranslation from '@/shared/hooks/useTranslation';
import {padNumber} from '@/shared/utils/general';

import QuestionAnswerItem from './QuestionAnswerItem';

interface ChecklistRecordSectionProps {
  sectionTitle: string;
  sectionIndex: number;
  answers: any[];
}

// One numbered section of a record's answers. Sections stack inside a single
// card, so this renders a plain block and leaves the surface to its parent.
const ChecklistRecordSection = ({
  sectionTitle,
  sectionIndex,
  answers,
}: ChecklistRecordSectionProps) => {
  const {t} = useTranslation();

  return (
    <Box className='px-4 py-6 md:px-6'>
      <Box className='mb-5 flex items-baseline gap-4'>
        <Typography
          component='span'
          className='min-w-7 shrink-0 text-xl font-bold'
          sx={{
            color: 'text.disabled',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.01em',
          }}
        >
          {padNumber({n: sectionIndex + 1})}
        </Typography>
        <Typography variant='h6' className='flex-1 font-bold'>
          {sectionTitle}
        </Typography>
        <Typography
          variant='caption'
          className='font-medium'
          sx={{color: 'text.disabled'}}
        >
          {t('assessments.sectionQuestionsCount', {count: answers.length})}
        </Typography>
      </Box>

      <Stack spacing={5} divider={<Divider flexItem sx={{opacity: 0.5}} />}>
        {answers.map((answer: any) => {
          const question = answer.question || {};
          const key = answer.id ?? answer.questionId;

          // A template edit gives its questions new ids, orphaning answers filed before it.
          return (
            <QuestionAnswerItem
              key={key}
              questionTitle={
                question.title || t('submissions.detail.questionUnavailable')
              }
              type={question.type}
              value={answer.value}
              comment={answer.comment}
              attachments={(answer.images || []).concat(answer.files || [])}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default ChecklistRecordSection;
