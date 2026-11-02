'use client';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {alpha, useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import ChecklistQuestionItem from './ChecklistQuestionItem';
import SectionNotesPanel from './SectionNotesPanel';
import {
  ChecklistAnswer,
  ChecklistSection,
  SectionAttachment,
  isSectionComplete,
} from './types';

interface ChecklistSectionCardProps {
  section: ChecklistSection;
  sectionNumber: number;
  answers: ChecklistAnswer[];
  onAnswerChange: (params: {answer: ChecklistAnswer}) => void;
  onSectionCommentChange: (params: {
    sectionId: string;
    comment: string;
  }) => void;
  sectionComment: string;
  attachments: SectionAttachment[];
  onAttachmentsChange: (params: {
    sectionId: string;
    attachments: SectionAttachment[];
  }) => void;
  attachmentAccept?: string;
  attachmentMaxFiles?: number;
}

const ChecklistSectionCard = ({
  section,
  sectionNumber,
  answers,
  onAnswerChange,
  onSectionCommentChange,
  sectionComment,
  attachments,
  onAttachmentsChange,
  attachmentAccept,
  attachmentMaxFiles,
}: ChecklistSectionCardProps) => {
  const theme = useTheme();

  const isComplete = isSectionComplete({section, answers});

  return (
    <Card elevation={6}>
      <CardContent sx={{py: 5, px: 5}}>
        {/* Section Header */}
        <Box className='flex items-center' sx={{gap: 2, mb: 4}}>
          <Box
            sx={{
              width: 32,
              height: 32,
              minWidth: 32,
              borderRadius: '50%',
              bgcolor: isComplete
                ? 'success.main'
                : alpha(theme.palette.primary.main, 0.1),
              color: isComplete ? 'common.white' : 'primary.main',
              transition: 'all 0.3s ease',
            }}
            className='flex items-center justify-center text-[0.8rem] font-bold'
          >
            {isComplete ? (
              <Icon icon='mdi:check' fontSize='1.1rem' />
            ) : (
              sectionNumber
            )}
          </Box>
          <Typography variant='h6' sx={{fontWeight: 600}}>
            {section.title}
          </Typography>
        </Box>

        {/* Questions */}
        <Box className='flex flex-col' sx={{gap: 5, pl: {xs: 0, md: 6}}}>
          {section.questions.map((question, qIndex) => {
            const answer = answers.find(
              (a) => a.questionId === question.id
            ) || {
              questionId: question.id,
              selectedOption: '',
              comment: '',
            };

            return (
              <ChecklistQuestionItem
                key={question.id}
                index={qIndex}
                question={question}
                answer={answer}
                onAnswerChange={onAnswerChange}
              />
            );
          })}
        </Box>

        {/* Notes & Attachments */}
        <SectionNotesPanel
          sectionId={section.id}
          comment={sectionComment}
          attachments={attachments}
          onCommentChange={onSectionCommentChange}
          onAttachmentsChange={onAttachmentsChange}
          attachmentAccept={attachmentAccept}
          attachmentMaxFiles={attachmentMaxFiles}
        />
      </CardContent>
    </Card>
  );
};

export default ChecklistSectionCard;
