'use client';

import {useMemo} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {controlHeight, layout, radius} from '@/@core/theme/spacing';
import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import Link from '@/shared/components/common/localeLink';
import {CAREGIVER_SENT_STATUSES} from '@/shared/constants/caregiver';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import useTranslation from '@/shared/hooks/useTranslation';
import {ChecklistSection} from '@/shared/interfaces/checklist';
import {assessmentQueries} from '@/shared/reactQuery';
import {isChecklistOpen} from '@/shared/utils/caregiverChecklists';
import {getFullName} from '@/shared/utils/general';
import {
  buildPatientPanelFacts,
  buildPatientFromSubmission,
  buildPatientIdentityLine,
  transformPatientResponse,
} from '@/shared/utils/patientUtils';
import ChecklistRunnerSkeleton from '@/views/pages/caregiverChecklist/ChecklistRunnerSkeleton';
import ChecklistRunnerView from '@/views/pages/caregiverChecklist/ChecklistRunnerView';
import {
  flattenRunnerQuestions,
  seedAnswersFromSubmission,
} from '@/views/pages/caregiverChecklist/utils';
import ChecklistSubmittedUI from '@/views/pages/checklist/ChecklistSubmittedUI';
import {mapChecklistSections} from '@/views/pages/checklist/types';

interface Props {
  submissionId: string;
}

/**
 * Filling one checklist due. Two requests, the same two the old page made:
 * the submission for the patient, the status and the assignment note, then the
 * template for the sections and questions.
 */
const CaregiverChecklistPage = ({submissionId}: Props) => {
  const {t} = useTranslation();

  const {useFetchSubmission, useFetchAssessmentTemplate} = assessmentQueries();

  const {
    data: submissionData,
    isLoading: isSubmissionLoading,
    isError: isSubmissionError,
  } = useFetchSubmission({id: submissionId, params: {...SUB_ROUTE_PARAMS}});

  const submission = submissionData?.submission;

  const checklistTemplateId = submission?.checklistTemplateId;

  const {
    data: templateData,
    isLoading: isTemplateLoading,
    isError: isTemplateError,
  } = useFetchAssessmentTemplate({
    id: checklistTemplateId || '',
    enabled: Boolean(checklistTemplateId),
    params: {...SUB_ROUTE_PARAMS},
  });

  const sections: ChecklistSection[] = useMemo(
    () => mapChecklistSections({sections: templateData?.template?.sections}),
    [templateData]
  );

  const questions = useMemo(
    () => flattenRunnerQuestions({sections}),
    [sections]
  );

  const submissionAnswers = useMemo(
    () => (Array.isArray(submission?.answers) ? submission.answers : []),
    [submission]
  );

  const seededAnswers = useMemo(
    () => seedAnswersFromSubmission({questions, submissionAnswers}),
    [questions, submissionAnswers]
  );

  if (isSubmissionLoading || isTemplateLoading) {
    return <ChecklistRunnerSkeleton />;
  }

  if (isSubmissionError || !submission) {
    return (
      <ContentNotAvailable
        title={t('patients.notFoundTitle')}
        message={t('patients.notFoundMessage')}
      />
    );
  }

  const rawPatient = submission.patient || {};

  const patientFirstName = rawPatient.firstName || '';

  const patientName = getFullName({
    firstName: patientFirstName,
    lastName: rawPatient.lastName || '',
  });

  // Nothing renders without the template, neither the read-back nor the run.
  // No questions means no checklist she could send or read, so she is told
  // that rather than shown an empty run or a record of zero answers.
  if (isTemplateError || !checklistTemplateId || questions.length === 0) {
    return (
      <ContentNotAvailable
        title={t('caregiverChecklist.unavailable.title')}
        message={t('caregiverChecklist.unavailable.message')}
      />
    );
  }

  // The API would refuse an answer on this one, so the question flow is never
  // opened: she either reads back what she sent, or is told it is closed.
  if (
    !isChecklistOpen({
      status: submission.status,
      deadline: submission.deadline,
    })
  ) {
    if (CAREGIVER_SENT_STATUSES.includes(submission.status)) {
      return (
        <ChecklistSubmittedUI
          patient={buildPatientFromSubmission({submission})}
          sections={sections}
          questions={questions}
          answers={questions.map((question) => ({
            questionId: question.id,
            selectedOption: seededAnswers[question.id]?.value || '',
            comment: seededAnswers[question.id]?.comment || '',
          }))}
        />
      );
    }

    return (
      <Box sx={{maxWidth: layout.formMaxWidth, pt: 8}}>
        <Typography variant='h1'>
          {t('caregiverChecklist.closed.title')}
        </Typography>

        <Button
          component={Link}
          href={DASHBOARD_ROUTES.home()}
          variant='contained'
          sx={{
            mt: 6,
            minHeight: controlHeight.xl,
            px: 6,
            borderRadius: `${radius.md}px`,
            fontWeight: 700,
          }}
        >
          {t('caregiverPortal.backToToday')}
        </Button>
      </Box>
    );
  }

  // Age and county next to the name; date of birth, gender and phone below it.
  const patient = transformPatientResponse({patient: rawPatient});

  const patientDetail = buildPatientIdentityLine({
    patient,
    parts: ['age', 'county'],
  });

  return (
    <ChecklistRunnerView
      submissionId={submissionId}
      patientId={submission.patientId || ''}
      patientName={patientName}
      patientFirstName={patientFirstName}
      patientDetail={patientDetail}
      patientFacts={buildPatientPanelFacts({patient, t})}
      checklistName={submission.checklistTemplate?.title || ''}
      assignmentNote={submission.assignment?.notes || ''}
      questions={questions}
      seededAnswers={seededAnswers}
    />
  );
};

export default CaregiverChecklistPage;
