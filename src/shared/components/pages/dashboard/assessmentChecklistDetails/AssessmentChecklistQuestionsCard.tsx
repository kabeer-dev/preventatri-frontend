'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import useTranslation from '@/shared/hooks/useTranslation';
import {AssessmentChecklistQuestionsCardProps} from '@/shared/interfaces/assessmentChecklistDetails';
import {
  getQuestionNumber,
  isPatientChecklist,
} from '@/shared/utils/checklistBuilderUtils';

import AssessmentChecklistQuestionRow from './AssessmentChecklistQuestionRow';

const AssessmentChecklistQuestionsCard = ({
  checklist,
}: AssessmentChecklistQuestionsCardProps) => {
  const {t} = useTranslation();

  const sections = [...checklist.sections].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  const itemCount = sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );
  const showFlags = isPatientChecklist({type: checklist.type});

  return (
    <Card>
      <Box
        className='flex items-center justify-between'
        sx={{px: 4, py: 3, borderBottom: 1, borderColor: 'divider'}}
      >
        <Typography variant='h6'>
          {t('assessmentChecklists.detail.questions')}
        </Typography>
        <Typography variant='body2' sx={{color: 'text.secondary'}}>
          {t('assessmentChecklists.detail.structure', {
            sections: t('assessmentChecklists.detail.sectionCount', {
              count: sections.length,
            }),
            items: t('assessmentChecklists.detail.itemCount', {
              count: itemCount,
            }),
          })}
        </Typography>
      </Box>

      {itemCount === 0 && (
        <Typography variant='body2' sx={{p: 4, color: 'text.secondary'}}>
          {t('assessmentChecklists.detail.noQuestions')}
        </Typography>
      )}

      {sections.map((section, sectionIndex) => (
        <Box key={section.id}>
          <Typography
            variant='overline'
            component='div'
            sx={{px: 4, pt: 3, color: 'text.secondary'}}
          >
            {section.title}
          </Typography>

          {[...section.questions]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((question, questionIndex) => (
              <AssessmentChecklistQuestionRow
                key={question.id}
                question={question}
                number={getQuestionNumber({sectionIndex, questionIndex})}
                showFlags={showFlags}
              />
            ))}
        </Box>
      ))}
    </Card>
  );
};

export default AssessmentChecklistQuestionsCard;
