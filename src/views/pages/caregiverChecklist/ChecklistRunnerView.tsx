'use client';

import {useCallback, useEffect, useRef} from 'react';

import {ConfirmationModal} from '@/shared/components/common/modals/ConfirmationModal';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import useUnsavedChangesGuard from '@/shared/hooks/useUnsavedChangesGuard';
import {
  RunnerAnswers,
  RunnerQuestion,
} from '@/shared/interfaces/caregiverChecklistRunner';
import {DetailFact} from '@/shared/interfaces/uiComponents';
import {useRegisterCurrentPatient} from '@/shared/providers/CaregiverRedFlagProvider';
import {assessmentMutations} from '@/shared/reactQuery';
import DesktopRunner from '@/views/pages/caregiverChecklist/DesktopRunner';
import PhoneRunner from '@/views/pages/caregiverChecklist/PhoneRunner';
import SentView from '@/views/pages/caregiverChecklist/SentView';
import SummaryView from '@/views/pages/caregiverChecklist/SummaryView';
import useChecklistRunner from '@/views/pages/caregiverChecklist/useChecklistRunner';

interface Props {
  submissionId: string;
  patientId: string;
  patientName: string;
  patientFirstName: string;
  patientDetail: string;
  patientFacts: DetailFact[];
  checklistName: string;
  assignmentNote: string;
  questions: RunnerQuestion[];
  seededAnswers: RunnerAnswers;
}

/**
 * Holds the state machine and picks the screen. The two renderers below it are
 * the same run at two widths, so everything that is not layout lives here.
 */
const ChecklistRunnerView = ({
  submissionId,
  patientId,
  patientName,
  patientFirstName,
  patientDetail,
  patientFacts,
  checklistName,
  assignmentNote,
  questions,
  seededAnswers,
}: Props) => {
  const {t} = useTranslation();
  const {push} = useLocaleRouter();

  const isDesktop = useIsDesktop();

  // A red flag raised from this checklist is about this same patient.
  useRegisterCurrentPatient({id: patientId, name: patientName});

  const {useUpdateSubmissionMutation} = assessmentMutations();

  const {mutate: updateSubmission, isPending: isSubmitting} =
    useUpdateSubmissionMutation();

  // Nothing is saved until she sends, so leaving always asks first.
  const {isConfirmOpen, requestClose, confirmClose, cancelClose} =
    useUnsavedChangesGuard({
      isDirty: true,
      isLoading: isSubmitting,
      onClose: () => push({url: DASHBOARD_ROUTES.home()}),
    });

  // The success handler has to reach into the machine that is created below
  // it, so it goes through a ref rather than a closure over a later const.
  const markSentRef = useRef<() => void>(() => {});

  const handleSubmit = useCallback(
    ({formData}: {formData: FormData}) => {
      updateSubmission({
        params: {id: submissionId},
        payload: formData,
        callBackFuncs: {onSuccess: () => markSentRef.current()},
      });
    },
    [submissionId, updateSubmission]
  );

  const runner = useChecklistRunner({
    questions,
    seededAnswers,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    markSentRef.current = runner.markSent;
  }, [runner.markSent]);

  // A reload or a closed tab would lose every answer, so the browser asks
  // first until the checklist is with the nurse. Links inside the app go
  // through the Exit confirmation instead.
  useEffect(() => {
    if (runner.mode === 'sent') return undefined;

    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', warn);

    return () => window.removeEventListener('beforeunload', warn);
  }, [runner.mode]);

  if (runner.mode === 'sent') {
    return (
      <SentView
        submissionId={submissionId}
        patientId={patientId}
        patientName={patientName}
        patientFirstName={patientFirstName}
        checklistName={checklistName}
        sentAt={runner.sentAt}
      />
    );
  }

  const viewProps = {
    runner,
    patientName,
    patientDetail,
    patientFacts,
    checklistName,
    assignmentNote,
    isSubmitting,
    onSaveAndExit: requestClose,
  };

  return (
    <>
      {runner.mode === 'summary' ? (
        <SummaryView {...viewProps} />
      ) : isDesktop ? (
        <DesktopRunner {...viewProps} />
      ) : (
        <PhoneRunner {...viewProps} />
      )}

      <ConfirmationModal
        isOpen={isConfirmOpen}
        title={t('caregiverChecklist.exit.title')}
        content={t('caregiverChecklist.exit.body')}
        confirmLabel={t('caregiverChecklist.exit.confirm')}
        dismissLabel={t('caregiverChecklist.exit.cancel')}
        confirmButtonColor='primary'
        onConfirm={confirmClose}
        onCancel={cancelClose}
      />
    </>
  );
};

export default ChecklistRunnerView;
