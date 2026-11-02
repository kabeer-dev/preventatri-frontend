'use client';

import {useCallback, useMemo, useState} from 'react';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import useChecklistAnswers from '@/shared/hooks/useChecklistAnswers';
import useTranslation from '@/shared/hooks/useTranslation';
import {assessmentMutations, assessmentQueries} from '@/shared/reactQuery';
import {buildSectionChecklistFormData} from '@/shared/utils/assessmentChecklistUtils';
import {buildPatientFromSubmission} from '@/shared/utils/patientUtils';

import ChecklistFormLayout from './ChecklistFormLayout';
import ChecklistSubmittedUI from './ChecklistSubmittedUI';
import {
  ChecklistAnswer,
  ChecklistQuestion,
  ChecklistSection,
  mapChecklistSections,
  SectionAttachment,
} from './types';

interface SubmissionChecklistPageProps {
  submissionId: string;
}

const flattenSections = ({
  sections,
}: {
  sections: ChecklistSection[];
}): ChecklistQuestion[] => sections.flatMap((s) => s.questions);

const SubmissionChecklistPage = ({
  submissionId,
}: SubmissionChecklistPageProps) => {
  const {t} = useTranslation();

  // State
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [sectionComments, setSectionComments] = useState<
    Record<string, string>
  >({});

  const [sectionAttachments, setSectionAttachments] = useState<
    Record<string, SectionAttachment[]>
  >({});

  // Queries — only 2 requests: submission + template
  const {useFetchSubmission, useFetchAssessmentTemplate} = assessmentQueries();
  const {useUpdateSubmissionMutation} = assessmentMutations();

  // 1. Fetch submission → gives us patientId, checklistTemplateId, patient name
  const {
    data: submissionData,
    isLoading: isSubmissionLoading,
    isError: isSubmissionError,
  } = useFetchSubmission({id: submissionId, params: {...SUB_ROUTE_PARAMS}});

  const checklistTemplateId = submissionData?.submission?.checklistTemplateId;

  const assignmentNote: string | null =
    submissionData?.submission?.assignment?.notes ?? null;

  // 2. Fetch template → gives us sections/questions for the form
  const {data: templateDetailData, isLoading: isTemplateDetailLoading} =
    useFetchAssessmentTemplate({
      id: checklistTemplateId || '',
      enabled: !!checklistTemplateId,
      params: {...SUB_ROUTE_PARAMS},
    });

  const {mutate: updateSubmission, isPending: isSubmitting} =
    useUpdateSubmissionMutation();

  // Derived data — build patient from submission's nested data (no extra request)
  const patient = useMemo(() => {
    const submission = submissionData?.submission;
    if (!submission) return null;

    return buildPatientFromSubmission({submission});
  }, [submissionData]);

  const checklistSections: ChecklistSection[] = useMemo(
    () =>
      mapChecklistSections({sections: templateDetailData?.template?.sections}),
    [templateDetailData]
  );

  const allQuestions = useMemo(
    () => flattenSections({sections: checklistSections}),
    [checklistSections]
  );

  // Initialize answers when template loads
  const templateId = templateDetailData?.template?.id;

  const {answers, setAnswers} = useChecklistAnswers({
    allQuestions,
    templateId,
  });

  // Handlers
  const handleAnswerChange = useCallback(
    ({answer}: {answer: ChecklistAnswer}) => {
      setAnswers((prev) =>
        prev.map((a) => (a.questionId === answer.questionId ? answer : a))
      );
    },
    [setAnswers]
  );

  const handleSectionCommentChange = useCallback(
    ({sectionId, comment}: {sectionId: string; comment: string}) => {
      setSectionComments((prev) => ({...prev, [sectionId]: comment}));
    },
    []
  );

  const handleAttachmentsChange = useCallback(
    ({
      sectionId,
      attachments,
    }: {
      sectionId: string;
      attachments: SectionAttachment[];
    }) => {
      setSectionAttachments((prev) => ({...prev, [sectionId]: attachments}));
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (!checklistTemplateId) return;

    const formData = buildSectionChecklistFormData({
      sections: checklistSections,
      answers,
      sectionComments,
      sectionAttachments,
      scoreOnlySelect: true,
    });

    updateSubmission({
      params: {id: submissionId},
      payload: formData,
      callBackFuncs: {
        onSuccess: () => setIsSubmitted(true),
      },
    });
  }, [
    checklistTemplateId,
    submissionId,
    answers,
    checklistSections,
    sectionComments,
    sectionAttachments,
    updateSubmission,
  ]);

  // Loading / Error states
  if (isSubmissionLoading) {
    return <PageSkeleton {...PAGE_SKELETONS.checklistFormSections} />;
  }

  if (isSubmissionError || !submissionData?.submission) {
    return (
      <ContentNotAvailable
        title={t('patients.notFoundTitle')}
        message={t('patients.notFoundMessage')}
      />
    );
  }

  if (!patient) {
    return (
      <ContentNotAvailable
        title={t('patients.notFoundTitle')}
        message={t('patients.notFoundMessage')}
      />
    );
  }

  if (isSubmitted) {
    return (
      <ChecklistSubmittedUI
        patient={patient}
        questions={allQuestions}
        answers={answers}
        sections={checklistSections}
        sectionComments={sectionComments}
        sectionAttachments={sectionAttachments}
      />
    );
  }

  return (
    <ChecklistFormLayout
      patient={patient}
      templatesList={[]}
      onTemplateSelect={() => {}}
      isTemplateDetailLoading={isTemplateDetailLoading}
      selectedTemplateId={checklistTemplateId || null}
      templateTitle={
        templateDetailData?.template?.title || t('checklist.weeklyTitle')
      }
      checklistSections={checklistSections}
      answers={answers}
      sectionComments={sectionComments}
      sectionAttachments={sectionAttachments}
      onAnswerChange={handleAnswerChange}
      onSectionCommentChange={handleSectionCommentChange}
      onAttachmentsChange={handleAttachmentsChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      hideTemplateSelector
      assignmentNote={assignmentNote}
    />
  );
};

export default SubmissionChecklistPage;
