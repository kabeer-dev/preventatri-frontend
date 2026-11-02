'use client';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ChecklistRecordSection from '@/shared/components/common/checklistRecordDetails/ChecklistRecordSection';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpAnswersCardProps} from '@/shared/interfaces/followUp';
import {groupAnswersBySection} from '@/shared/utils/assessmentChecklistUtils';

const FollowUpAnswersCard = ({answers}: FollowUpAnswersCardProps) => {
  const {t} = useTranslation();

  const sections = groupAnswersBySection({
    answers,
    fallbackTitle: t('commonContent.general'),
  });

  return (
    <Card elevation={6}>
      <Typography variant='h6' className='px-4 pt-6 font-bold md:px-6'>
        {t('followUps.detail.answers')}
      </Typography>

      <Stack divider={<Divider />}>
        {sections.map((section, index) => (
          <ChecklistRecordSection
            key={section.sectionTitle}
            sectionTitle={section.sectionTitle}
            sectionIndex={index}
            answers={section.answers}
          />
        ))}
      </Stack>
    </Card>
  );
};

export default FollowUpAnswersCard;
