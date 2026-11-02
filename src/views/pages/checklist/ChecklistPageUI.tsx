'use client';

import {Icon} from '@iconify/react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ChecklistSectionCard from './ChecklistSectionCard';
import ProgressBubble from './ProgressBubble';
import {
  ChecklistAnswer,
  ChecklistSection,
  SectionAttachment,
  isSectionComplete,
} from './types';

interface ChecklistPageUIProps {
  title: string;
  submitButtonText: string;
  sections: ChecklistSection[];
  answers: ChecklistAnswer[];
  sectionComments: Record<string, string>;
  sectionAttachments: Record<string, SectionAttachment[]>;
  onAnswerChange: ({answer}: {answer: ChecklistAnswer}) => void;
  onSectionCommentChange: ({
    sectionId,
    comment,
  }: {
    sectionId: string;
    comment: string;
  }) => void;
  onAttachmentsChange: ({
    sectionId,
    attachments,
  }: {
    sectionId: string;
    attachments: SectionAttachment[];
  }) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  attachmentAccept?: string;
  attachmentMaxFiles?: number;
}

const ChecklistPageUI = ({
  title,
  submitButtonText,
  sections,
  answers,
  sectionComments,
  sectionAttachments,
  onAnswerChange,
  onSectionCommentChange,
  onAttachmentsChange,
  onSubmit,
  isSubmitting,
  attachmentAccept,
  attachmentMaxFiles,
}: ChecklistPageUIProps) => {
  const completedCount = sections.filter((s) =>
    isSectionComplete({section: s, answers})
  ).length;

  const allComplete = completedCount === sections.length;

  return (
    <div className='flex flex-col gap-3.5'>
      <Typography variant='h5' className='font-bold'>
        {title}
      </Typography>

      <fieldset disabled={isSubmitting} className='contents'>
        {sections.map((section, idx) => (
          <ChecklistSectionCard
            key={section.id}
            section={section}
            sectionNumber={idx + 1}
            answers={answers}
            onAnswerChange={onAnswerChange}
            onSectionCommentChange={onSectionCommentChange}
            sectionComment={sectionComments[section.id] || ''}
            attachments={sectionAttachments[section.id] || []}
            onAttachmentsChange={onAttachmentsChange}
            attachmentAccept={attachmentAccept}
            attachmentMaxFiles={attachmentMaxFiles}
          />
        ))}
      </fieldset>

      <Button
        variant='contained'
        color={allComplete ? 'success' : 'primary'}
        size='large'
        fullWidth
        disabled={!allComplete || isSubmitting}
        loading={isSubmitting}
        startIcon={<Icon icon='mdi:check-all' />}
        onClick={onSubmit}
        className='font-semibold text-base mt-4'
        sx={{py: 1.75}}
      >
        {submitButtonText}
      </Button>

      <ProgressBubble completed={completedCount} total={sections.length} />
    </div>
  );
};

export default ChecklistPageUI;
