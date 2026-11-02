'use client';

import {ReactNode} from 'react';

import {Icon} from '@iconify/react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import AttachmentGallery from '@/shared/components/common/AttachmentGallery';
import DetailSplitLayout from '@/shared/components/common/DetailSplitLayout';
import RecordHeading from '@/shared/components/common/headers/RecordHeading';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {getSubmissionStatusConfig} from '@/shared/constants/assessmentChecklists';
import {
  DETAIL_EMPTY_VALUE,
  DETAIL_IDENTITY_SEPARATOR,
} from '@/shared/constants/common';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {groupAnswersBySection} from '@/shared/utils/assessmentChecklistUtils';
import {formatDate} from '@/shared/utils/dateUtils';

import ChecklistRecordSection from './ChecklistRecordSection';
import PersonDetailCard from './PersonDetailCard';

interface AssigneeSectionConfig {
  title?: string;
  titleIcon?: string;
  profileHref?: string;
  hidden?: boolean;
}

interface ChecklistRecordDetailsUIProps {
  submission: any;
  crumb: string;
  assigneeSection?: AssigneeSectionConfig;
  emptyAnswersContent?: ReactNode;
  extraSidebarContent?: ReactNode;
  headerAction?: ReactNode;
}

const ChecklistRecordDetailsUI = ({
  submission,
  crumb,
  assigneeSection,
  emptyAnswersContent,
  extraSidebarContent,
  headerAction,
}: ChecklistRecordDetailsUIProps) => {
  const {t} = useTranslation();
  const {isAdmin, isCaregiver} = useUserRole();

  const patient = submission.patient || {};
  const user = submission.assignee || {};
  const template = submission.checklistTemplate || {};
  const answers: any[] = submission.answers || [];

  const patientName =
    `${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim() ||
    DETAIL_EMPTY_VALUE;

  const assigneeName =
    `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
    DETAIL_EMPTY_VALUE;

  const patientAddress = [patient.address, patient.city]
    .filter(Boolean)
    .join(', ');

  const sections = groupAnswersBySection({
    answers,
    fallbackTitle: t('commonContent.general'),
  });

  const submittedAtLabel = submission.submittedAt
    ? formatDate({
        date: submission.submittedAt,
        format: 'dd MMM yyyy, hh:mm a',
      })
    : '';

  const voidedAtLabel = submission.voidedAt
    ? formatDate({date: submission.voidedAt, format: 'dd MMM yyyy, hh:mm a'})
    : '';

  // The template and the record's dates identify this record; they read as one
  // line under the name in the top bar rather than as a banner of their own.
  const identityLine = [
    template.title,
    submittedAtLabel &&
      `${t('submissions.detail.submittedAt')} ${submittedAtLabel}`,
    voidedAtLabel && `${t('submissions.detail.voidedAt')} ${voidedAtLabel}`,
    submission.dueDateLabel &&
      `${submission.dueDateLabelTitle || t('submissions.detail.dueDate')} ${
        submission.dueDateLabel
      }`,
  ]
    .filter(Boolean)
    .join(DETAIL_IDENTITY_SEPARATOR);

  const {label: statusLabel, color: statusColor} = getSubmissionStatusConfig({
    status: submission.status || '',
    t,
  });

  const assigneeTitle =
    assigneeSection?.title ?? t('submissions.detail.caregiverDetails');

  const assigneeIcon = assigneeSection?.titleIcon ?? 'mdi:account-tie-outline';

  const defaultAssigneeHref = submission.assignment?.caregiverProfileId
    ? DASHBOARD_ROUTES.caregivers.single({
        id: submission.assignment.caregiverProfileId,
      })
    : undefined;

  const assigneeHref = isAdmin
    ? (assigneeSection?.profileHref ?? defaultAssigneeHref)
    : undefined;
  const showAssigneeSection = !assigneeSection?.hidden && !isCaregiver;

  const hasNoAnswerContent =
    !submission.visitInstructions &&
    !submission.visitNotes &&
    !submission.voidReason;

  return (
    <>
      <TopBarSlot side='left'>
        <RecordHeading
          crumb={crumb}
          name={patientName}
          identityLine={identityLine}
          status={
            <CustomChip
              skin='light'
              size='small'
              label={statusLabel}
              color={statusColor}
            />
          }
        />
      </TopBarSlot>

      {headerAction && <TopBarSlot side='right'>{headerAction}</TopBarSlot>}

      <DetailSplitLayout
        main={
          <>
            {sections.length === 0 &&
              (emptyAnswersContent ??
                (hasNoAnswerContent ? (
                  <Card elevation={6}>
                    <CardContent className='py-8 text-center'>
                      <Typography
                        variant='body2'
                        sx={{color: 'text.secondary'}}
                      >
                        {t('submissions.detail.noAnswers')}
                      </Typography>
                    </CardContent>
                  </Card>
                ) : null))}

            {/* Every answered section lives on one surface: the record reads as
                a single document, with a rule where one section ends. */}
            {sections.length > 0 && (
              <Card elevation={6}>
                <Stack divider={<Divider />}>
                  {sections.map(
                    ({sectionTitle, answers: sectionAnswers}, idx) => (
                      <ChecklistRecordSection
                        key={`${sectionTitle}-${idx}`}
                        sectionTitle={sectionTitle}
                        sectionIndex={idx}
                        answers={sectionAnswers}
                      />
                    )
                  )}
                </Stack>
              </Card>
            )}

            {submission.visitInstructions && (
              <Card elevation={6}>
                <CardContent className='px-3 py-6 md:px-4'>
                  <Typography
                    variant='h6'
                    className='mb-3 flex items-center gap-2 font-bold'
                  >
                    <Icon
                      icon='mdi:clipboard-text-outline'
                      fontSize='1.25rem'
                      color='var(--mui-palette-warning-main)'
                    />
                    {submission.visitInstructionsTitle ||
                      t('submissions.detail.visitInstructions')}
                  </Typography>
                  <div className='rounded border-l-[3px] border-l-(--mui-palette-warning-main) bg-(--mui-palette-action-hover) p-4'>
                    <Typography variant='body2' className='whitespace-pre-wrap'>
                      {submission.visitInstructions}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            )}

            {submission.visitNotes && (
              <Card elevation={6}>
                <CardContent className='px-3 py-6 md:px-4'>
                  <Typography
                    variant='h6'
                    className='mb-1 flex items-center gap-2 font-bold'
                  >
                    <Icon
                      icon='mdi:note-edit-outline'
                      fontSize='1.25rem'
                      color='var(--mui-palette-primary-main)'
                    />
                    {t('submissions.detail.visitNotes')}
                  </Typography>
                  {(submission.completionSourceLabel ||
                    submission.completedByName) && (
                    <Typography
                      variant='caption'
                      className='mb-3 ml-7 block'
                      sx={{color: 'text.secondary'}}
                    >
                      {submission.completionSourceLabel}
                      {submission.completionSourceLabel &&
                        submission.completedByName &&
                        DETAIL_IDENTITY_SEPARATOR}
                      {submission.completedByName &&
                        t('submissions.detail.completedBy', {
                          name: submission.completedByName,
                        })}
                    </Typography>
                  )}
                  <div className='rounded border-l-[3px] border-l-(--mui-palette-primary-main) bg-(--mui-palette-action-hover) p-4'>
                    <Typography variant='body2' className='whitespace-pre-wrap'>
                      {submission.visitNotes}
                    </Typography>
                  </div>
                  {submission.visitNoteFiles?.length > 0 && (
                    <div className='mt-4'>
                      <Typography
                        variant='caption'
                        className='mb-2 block font-bold uppercase'
                        sx={{color: 'text.secondary', letterSpacing: 0.6}}
                      >
                        {t('submissions.detail.attachments')}
                      </Typography>
                      <AttachmentGallery
                        attachments={submission.visitNoteFiles.map(
                          (f: {url?: string; name?: string}, i: number) => ({
                            url: f.url || '',
                            key: f.url || String(i),
                            originalName: f.name,
                          })
                        )}
                        thumbnailSize={104}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {submission.voidReason && (
              <Card elevation={6}>
                <CardContent className='px-3 py-6 md:px-4'>
                  <Typography
                    variant='h6'
                    className='mb-3 flex items-center gap-2 font-bold'
                  >
                    <Icon
                      icon='mdi:cancel'
                      fontSize='1.25rem'
                      color='var(--mui-palette-warning-main)'
                    />
                    {t('submissions.detail.voidReason')}
                  </Typography>
                  <div className='rounded border-l-[3px] border-l-(--mui-palette-warning-main) bg-(--mui-palette-action-hover) p-4'>
                    <Typography variant='body2' className='whitespace-pre-wrap'>
                      {submission.voidReason}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        }
        rail={
          <>
            <PersonDetailCard
              titleIcon='mdi:account-heart-outline'
              title={t('submissions.detail.patientDetails')}
              rows={[
                {
                  icon: 'mdi:account-outline',
                  label: t('submissions.detail.name'),
                  value: patientName,
                },
                {
                  icon: 'mdi:phone-outline',
                  label: t('submissions.detail.phone'),
                  value: patient.phoneNo,
                },
                {
                  icon: 'mdi:map-marker-outline',
                  label: t('submissions.detail.address'),
                  value: patientAddress,
                },
              ]}
              profileHref={
                submission.patientId
                  ? DASHBOARD_ROUTES.patients.single({
                      id: submission.patientId,
                    })
                  : undefined
              }
            />

            {extraSidebarContent}

            {showAssigneeSection && (
              <PersonDetailCard
                titleIcon={assigneeIcon}
                title={assigneeTitle}
                rows={[
                  {
                    icon: 'mdi:account-outline',
                    label: t('submissions.detail.name'),
                    value: assigneeName,
                  },
                  {
                    icon: 'mdi:email-outline',
                    label: t('submissions.detail.email'),
                    value: user.email,
                  },
                  {
                    icon: 'mdi:phone-outline',
                    label: t('submissions.detail.phone'),
                    value: user.phoneNo,
                  },
                ]}
                profileHref={assigneeHref}
              />
            )}
          </>
        }
      />
    </>
  );
};

export default ChecklistRecordDetailsUI;
