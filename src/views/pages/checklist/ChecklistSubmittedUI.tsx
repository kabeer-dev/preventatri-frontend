'use client';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import {layout} from '@/@core/theme/spacing';
import ImageGallery from '@/shared/components/common/ImageGallery';
import Link from '@/shared/components/common/localeLink';
import PatientInfoBanner from '@/shared/components/common/PatientInfoBanner';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {Patient} from '@/shared/interfaces/patient';

import ChecklistSubmittedResponseItem from './ChecklistSubmittedResponseItem';
import ChecklistSuccessHeader from './ChecklistSuccessHeader';
import {
  ChecklistAnswer,
  ChecklistQuestion,
  ChecklistSection,
  SectionAttachment,
} from './types';

interface ChecklistSubmittedUIProps {
  patient: Patient;
  questions: ChecklistQuestion[];
  answers: ChecklistAnswer[];
  sections?: ChecklistSection[];
  sectionComments?: Record<string, string>;
  sectionAttachments?: Record<string, SectionAttachment[]>;
}

const ChecklistSubmittedUI = ({
  patient,
  questions,
  answers,
  sections,
  sectionComments = {},
  sectionAttachments = {},
}: ChecklistSubmittedUIProps) => {
  const {t} = useTranslation();
  const theme = useTheme();

  const answeredCount = answers.filter(
    (a) => a.selectedOption && a.selectedOption.length > 0
  ).length;

  return (
    <Box
      className='flex flex-col w-full mx-auto'
      sx={{maxWidth: layout.formMaxWidth, gap: 3, pb: 6, pt: {xs: 2, md: 4}}}
    >
      <ChecklistSuccessHeader
        answeredCount={answeredCount}
        totalQuestions={questions.length}
      />

      <PatientInfoBanner
        patient={patient}
        subtitle={t('checklist.submittedFor')}
        showContactInfo
      />

      {/* Responses */}
      {sections ? (
        sections.map((section) => {
          const comment = sectionComments[section.id] || '';
          const attachments = sectionAttachments[section.id] || [];

          return (
            <Card elevation={6} key={section.id}>
              <CardContent sx={{py: 4, px: 5}}>
                <Typography variant='subtitle1' sx={{fontWeight: 700, mb: 3}}>
                  {section.title}
                </Typography>

                {section.questions.map((question, qIdx) => (
                  <Box key={question.id}>
                    {qIdx > 0 && <Divider sx={{my: 3}} />}
                    <ChecklistSubmittedResponseItem
                      index={qIdx}
                      question={question}
                      answer={answers.find((a) => a.questionId === question.id)}
                      hideSection
                    />
                  </Box>
                ))}

                {(comment || attachments.length > 0) && (
                  <>
                    <Divider sx={{my: 3}} />
                    <Box className='flex flex-col' sx={{gap: 2}}>
                      <Typography
                        variant='caption'
                        className='flex items-center uppercase'
                        sx={{
                          fontWeight: 700,
                          letterSpacing: 0.5,
                          color: 'text.secondary',
                          gap: 0.75,
                        }}
                      >
                        <Icon icon='mdi:note-text-outline' fontSize='1rem' />
                        {t('checklist.notesAndAttachments')}
                      </Typography>

                      {comment && (
                        <Box
                          sx={{
                            pl: 2,
                            borderLeft: '2px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Typography
                            variant='body2'
                            sx={{
                              color: 'text.secondary',
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.7,
                            }}
                          >
                            {comment}
                          </Typography>
                        </Box>
                      )}

                      {attachments.length > 0 && (
                        <ImageGallery
                          images={attachments.map((att) => ({
                            url: att.preview,
                            key: att.id,
                          }))}
                          thumbnailSize={120}
                        />
                      )}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Card elevation={6}>
          <CardContent sx={{py: 5, px: 5}}>
            <Box className='flex items-center' sx={{gap: 1.5, mb: 4}}>
              <Icon
                icon='mdi:format-list-checks'
                fontSize='1.25rem'
                color={theme.palette.text.secondary}
              />
              <Typography variant='h6' sx={{fontWeight: 600}}>
                {t('checklist.yourResponses')}
              </Typography>
            </Box>

            {questions.map((question, index) => (
              <Box key={question.id}>
                {index > 0 && <Divider sx={{my: 3}} />}
                <ChecklistSubmittedResponseItem
                  index={index}
                  question={question}
                  answer={answers.find((a) => a.questionId === question.id)}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Box className='flex justify-center' sx={{gap: 2, mt: 1}}>
        <Button
          component={Link}
          variant='outlined'
          startIcon={<Icon icon='mdi:arrow-left' />}
          href={DASHBOARD_ROUTES.home()}
          sx={{textTransform: 'none', px: 3}}
        >
          {t('checklist.backToDashboard')}
        </Button>
      </Box>
    </Box>
  );
};

export default ChecklistSubmittedUI;
