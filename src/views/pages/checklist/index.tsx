'use client';

import {useCallback, useMemo, useState} from 'react';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {
  ASSESSMENT_CHECKLIST_STATUS,
  CHECKLIST_TEMPLATE_TYPES,
} from '@/shared/constants/assessmentChecklists';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import useChecklistAnswers from '@/shared/hooks/useChecklistAnswers';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  assessmentMutations,
  assessmentQueries,
  patientQueries,
} from '@/shared/reactQuery';
import {buildSubmissionFormData} from '@/shared/utils/assessmentChecklistUtils';
import {transformPatientResponse} from '@/shared/utils/patientUtils';

import ChecklistFormLayout from './ChecklistFormLayout';
import ChecklistSubmittedUI from './ChecklistSubmittedUI';
import {
  ChecklistAnswer,
  ChecklistQuestion,
  ChecklistSection,
  ChecklistTemplateItem,
  mapChecklistSections,
  SectionAttachment,
} from './types';

interface ChecklistPageProps {
  patientId: string;
}

const flattenSections = ({
  sections,
}: {
  sections: ChecklistSection[];
}): ChecklistQuestion[] => sections.flatMap((s) => s.questions);

const ChecklistPage = ({patientId}: ChecklistPageProps) => {
  const {t} = useTranslation();

  // State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [sectionComments, setSectionComments] = useState<
    Record<string, string>
  >({});

  const [sectionAttachments, setSectionAttachments] = useState<
    Record<string, SectionAttachment[]>
  >({});

  // Queries
  const {useFetchPatient} = patientQueries();

  const {useFetchAssessmentTemplatesList, useFetchAssessmentTemplate} =
    assessmentQueries();

  const {useCreateSubmissionMutation} = assessmentMutations();

  const {
    data: patientData,
    isLoading: isPatientLoading,
    isError: isPatientError,
  } = useFetchPatient({id: patientId});

  const {data: templatesData, isLoading: isTemplatesLoading} =
    useFetchAssessmentTemplatesList({
      params: {
        status: ASSESSMENT_CHECKLIST_STATUS.ACTIVE.value,
        type: CHECKLIST_TEMPLATE_TYPES.PATIENT.value,
        ...SUB_ROUTE_PARAMS,
      },
    });

  const {data: templateDetailData, isLoading: isTemplateDetailLoading} =
    useFetchAssessmentTemplate({
      id: selectedTemplateId || '',
      enabled: !!selectedTemplateId,
      params: {...SUB_ROUTE_PARAMS},
    });

  const {mutate: createSubmission, isPending: isSubmitting} =
    useCreateSubmissionMutation();

  // Derived data
  const patient = useMemo(() => {
    const raw = patientData?.patient;
    if (!raw) return null;

    return transformPatientResponse({patient: raw});
  }, [patientData]);

  const templatesList: ChecklistTemplateItem[] = useMemo(() => {
    const templates = templatesData?.templates || [];

    return templates.map((tmpl: any) => ({
      id: tmpl.id,
      title: tmpl.title,
      description: tmpl.description || '',
    }));
  }, [templatesData]);

  const checklistSections: ChecklistSection[] = useMemo(
    () =>
      mapChecklistSections({sections: templateDetailData?.template?.sections}),
    [templateDetailData]
  );

  const allQuestions = useMemo(
    () => flattenSections({sections: checklistSections}),
    [checklistSections]
  );

  // Initialize answers when a new template is loaded
  const templateId = templateDetailData?.template?.id;

  const {answers, setAnswers} = useChecklistAnswers({
    allQuestions,
    templateId,
  });

  // Handlers
  const handleTemplateSelect = useCallback(
    (_: any, value: ChecklistTemplateItem | null) => {
      setSelectedTemplateId(value?.id || null);
      setAnswers([]);
      setSectionComments({});
      setSectionAttachments({});
      setIsSubmitted(false);
    },
    [setAnswers]
  );

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
    if (!selectedTemplateId || !patientId) return;

    const sectionFirstQuestionMap: Record<string, string> = {};
    for (const section of checklistSections) {
      if (section.questions.length > 0) {
        sectionFirstQuestionMap[section.id] = section.questions[0].id;
      }
    }

    const questionCommentMap: Record<string, string> = {};
    for (const [sectionId, comment] of Object.entries(sectionComments)) {
      const questionId = sectionFirstQuestionMap[sectionId];
      if (questionId && comment) {
        questionCommentMap[questionId] = comment;
      }
    }

    // Comments and photos are kept per section and travel on the section's
    // first question; only a SELECT is scored off its options here.
    const formData = buildSubmissionFormData({
      questions: allQuestions,
      answers: answers.map((a) => ({
        questionId: a.questionId,
        value: a.selectedOption || null,
        comment: questionCommentMap[a.questionId] || null,
      })),
      attachments: Object.entries(sectionAttachments).flatMap(
        ([sectionId, atts]) => {
          const questionId = sectionFirstQuestionMap[sectionId];

          return questionId
            ? atts.map((att) => ({questionId, file: att.file}))
            : [];
        }
      ),
      fields: {checklistTemplateId: selectedTemplateId, patientId},
      scoreOnlySelect: true,
    });

    createSubmission({
      payload: formData,
      callBackFuncs: {
        onSuccess: () => setIsSubmitted(true),
      },
    });
  }, [
    selectedTemplateId,
    patientId,
    answers,
    allQuestions,
    checklistSections,
    sectionComments,
    sectionAttachments,
    createSubmission,
  ]);

  // Loading / Error states
  if (isPatientLoading || isTemplatesLoading) {
    return <PageSkeleton {...PAGE_SKELETONS.checklistForm} />;
  }

  if (!patient || isPatientError) {
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
      templatesList={templatesList}
      onTemplateSelect={handleTemplateSelect}
      isTemplateDetailLoading={isTemplateDetailLoading}
      selectedTemplateId={selectedTemplateId}
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
    />
  );
};

export default ChecklistPage;
