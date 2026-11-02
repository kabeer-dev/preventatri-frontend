'use client';

import {Icon} from '@iconify/react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {alpha, useTheme} from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {layout} from '@/@core/theme/spacing';
import PatientInfoBanner from '@/shared/components/common/PatientInfoBanner';
import SkeletonCard from '@/shared/components/common/skeletons/SkeletonCard';
import {WIDGET_SKELETONS} from '@/shared/constants/pageSkeletons';
import useTranslation from '@/shared/hooks/useTranslation';
import {Patient} from '@/shared/interfaces/patient';

import ChecklistPageUI from './ChecklistPageUI';
import {
  ChecklistAnswer,
  ChecklistSection,
  ChecklistTemplateItem,
  SectionAttachment,
} from './types';

interface ChecklistFormLayoutProps {
  patient: Patient;
  templatesList: ChecklistTemplateItem[];
  onTemplateSelect: (_: any, value: ChecklistTemplateItem | null) => void;
  isTemplateDetailLoading: boolean;
  selectedTemplateId: string | null;
  templateTitle: string;
  checklistSections: ChecklistSection[];
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
  hideTemplateSelector?: boolean;
  submitButtonText?: string;
  submittingForLabel?: string;
  attachmentAccept?: string;
  attachmentMaxFiles?: number;
  assignmentNote?: string | null;
}

const ChecklistFormLayout = ({
  patient,
  templatesList,
  onTemplateSelect,
  isTemplateDetailLoading,
  selectedTemplateId,
  templateTitle,
  checklistSections,
  answers,
  sectionComments,
  sectionAttachments,
  onAnswerChange,
  onSectionCommentChange,
  onAttachmentsChange,
  onSubmit,
  isSubmitting,
  hideTemplateSelector = false,
  submitButtonText,
  submittingForLabel,
  attachmentAccept,
  attachmentMaxFiles,
  assignmentNote,
}: ChecklistFormLayoutProps) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const hasAssignmentNote = Boolean(assignmentNote?.trim());

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: layout.formMaxWidth,
        mx: 'auto',
        pb: 6,
      }}
    >
      <PatientInfoBanner
        patient={patient}
        subtitle={submittingForLabel ?? t('checklist.submittingFor')}
        avatarSize={48}
        showContactInfo
      />

      {hasAssignmentNote && (
        <Card
          elevation={0}
          sx={{
            bgcolor: alpha(primaryColor, 0.06),
            border: `1px solid ${alpha(primaryColor, 0.2)}`,
          }}
        >
          <CardContent sx={{py: 3, px: {xs: 3, md: 4}}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1.5}}>
              <Icon
                icon='mdi:note-text-outline'
                fontSize='1.25rem'
                color={primaryColor}
              />
              <Typography
                variant='body1'
                sx={{fontWeight: 600, color: 'primary.main'}}
              >
                {t('checklist.assignmentNoteTitle')}
              </Typography>
            </Box>
            <Typography
              variant='body2'
              sx={{whiteSpace: 'pre-wrap', lineHeight: 1.7}}
            >
              {assignmentNote}
            </Typography>
          </CardContent>
        </Card>
      )}

      {!hideTemplateSelector && (
        <Card elevation={6}>
          <CardContent sx={{py: 4, px: {xs: 3, md: 5}}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
              <Icon icon='mdi:clipboard-list-outline' fontSize='1.25rem' />
              <Typography variant='body1' sx={{fontWeight: 600}}>
                {t('checklist.selectTemplate')}
              </Typography>
            </Box>

            <Autocomplete
              options={templatesList}
              value={
                templatesList.find(
                  (template) => template.id === selectedTemplateId
                ) || null
              }
              getOptionLabel={(option) => option.title}
              onChange={onTemplateSelect}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t('checklist.selectTemplatePlaceholder')}
                  size='small'
                />
              )}
            />
          </CardContent>
        </Card>
      )}

      {isTemplateDetailLoading &&
        selectedTemplateId &&
        Array.from(
          {length: WIDGET_SKELETONS.checklistSections.count},
          (_, index) => (
            <SkeletonCard
              key={index}
              {...WIDGET_SKELETONS.checklistSections.card}
            />
          )
        )}

      {checklistSections.length > 0 && !isTemplateDetailLoading && (
        <ChecklistPageUI
          title={templateTitle}
          submitButtonText={
            submitButtonText ?? t('assessments.submitAssessment')
          }
          sections={checklistSections}
          answers={answers}
          sectionComments={sectionComments}
          sectionAttachments={sectionAttachments}
          onAnswerChange={onAnswerChange}
          onSectionCommentChange={onSectionCommentChange}
          onAttachmentsChange={onAttachmentsChange}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          attachmentAccept={attachmentAccept}
          attachmentMaxFiles={attachmentMaxFiles}
        />
      )}
    </Box>
  );
};

export default ChecklistFormLayout;
