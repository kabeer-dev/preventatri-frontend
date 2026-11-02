'use client';

import Box from '@mui/material/Box';

import AlertEvidenceCard from '@/shared/components/common/alertReview/AlertEvidenceCard';
import AlertPeopleRail from '@/shared/components/common/alertReview/AlertPeopleRail';
import ChecklistEvidence from '@/shared/components/common/alertReview/ChecklistEvidence';
import EvidenceEmptyNote from '@/shared/components/common/alertReview/EvidenceEmptyNote';
import ReviewDetailLayout from '@/shared/components/common/alertReview/ReviewDetailLayout';
import DetailFactsCard from '@/shared/components/common/DetailFactsCard';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useAlertPeople from '@/shared/hooks/useAlertPeople';
import useAlertSeverityTone from '@/shared/hooks/useAlertSeverityTone';
import {useSubmissionActions} from '@/shared/hooks/useSubmissionActions';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {EvidenceCommentProps} from '@/shared/interfaces/alertReview';
import {SubmissionDetailsUIProps} from '@/shared/interfaces/submission';
import {
  getChecklistFlagSummary,
  getSubmissionSections,
} from '@/shared/utils/alertReview';
import {getSubmissionPermissions} from '@/shared/utils/submissionUtils';
import SubmissionActionDialogs from '@/views/pages/submissions/SubmissionActionDialogs';

import SubmissionNextStepCard from './SubmissionNextStepCard';
import SubmissionScheduleCard from './SubmissionScheduleCard';

const SubmissionDetailsUI = ({submission}: SubmissionDetailsUIProps) => {
  const {t} = useTranslation();
  const {isCaregiver, isAdmin, isNurse, isCaseManager} = useUserRole();
  const actions = useSubmissionActions();

  const {patientId, submittedAt, visitNotes, voidedAt, voidReason, risk} =
    submission;

  const people = useAlertPeople({
    patient: submission.patient,
    submitter: submission.assignee,
    reportedAt: submittedAt,
  });

  const tone = useAlertSeverityTone({flag: risk?.flag});

  const sections = getSubmissionSections({
    answers: submission.answers || [],
    fallbackTitle: t('commonContent.general'),
  });

  const {flagged, total} = getChecklistFlagSummary({sections});

  const riskFacts = [
    {
      label: t('submissions.detail.riskScore'),
      value: risk?.riskScore ?? null,
    },
    {
      label: t('submissions.detail.riskCategory'),
      value: risk?.riskCategory || null,
    },
  ].filter((fact) => fact.value !== null);

  const candidateComments: (EvidenceCommentProps | null)[] = [
    visitNotes
      ? {
          label: t('alertReview.evidence.visitNotes'),
          author: people.caregiverName,
          at: submittedAt,
          text: visitNotes,
        }
      : null,
    voidReason
      ? {
          label: t('submissions.detail.voidReason'),
          at: voidedAt,
          text: voidReason,
        }
      : null,
  ];

  const comments = candidateComments.filter(
    (comment): comment is EvidenceCommentProps => comment !== null
  );

  const permissions = getSubmissionPermissions({
    status: submission.status,
    isAdmin,
    isStaff: isAdmin || isNurse || isCaseManager,
  });

  const actionTarget = {
    id: submission.id,
    name: submission.checklistTemplate?.title || '',
    patientId,
    patient: submission.patient,
  };

  return (
    <>
      <ReviewDetailLayout
        backLabel={t('submissions.detail.backToList')}
        backHref={DASHBOARD_ROUTES.submissions.all()}
        name={people.patientName}
        people={
          <AlertPeopleRail
            people={people}
            patientId={patientId}
            hideReporter={isCaregiver}
          />
        }
        banner={
          !isCaregiver && (
            <SubmissionNextStepCard
              submission={submission}
              permissions={permissions}
              onSkip={() => actions.open.skip({submission: actionTarget})}
              onVoid={() => actions.open.void({submission: actionTarget})}
              onCreateFollowUp={() =>
                actions.open.followUp({submission: actionTarget})
              }
            />
          )
        }
        history={
          <Box sx={{display: 'grid', gap: 4}}>
            <SubmissionScheduleCard submission={submission} />
            <DetailFactsCard
              title={t('submissions.detail.riskReport')}
              facts={riskFacts}
              inline
            />
          </Box>
        }
        evidence={
          <AlertEvidenceCard
            tone={tone}
            reason={risk?.flag ? t(tone.labelKey) : undefined}
            reasonLabel={t('alertReview.evidence.riskResult')}
            reasonNote={
              total > 0
                ? t('alertReview.evidence.flaggedCount', {flagged, total})
                : undefined
            }
            meta={submission.checklistTemplate?.title}
            comments={comments}
          >
            {sections.length > 0 ? (
              <ChecklistEvidence sections={sections} />
            ) : (
              <EvidenceEmptyNote message={t('submissions.detail.noAnswers')} />
            )}
          </AlertEvidenceCard>
        }
      />

      <SubmissionActionDialogs
        target={actions.target}
        modals={actions.modals}
        handlers={actions.handlers}
        pending={actions.pending}
      />
    </>
  );
};

export default SubmissionDetailsUI;
