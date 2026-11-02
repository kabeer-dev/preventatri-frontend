'use client';

import {useEffect, useState} from 'react';

import {ConfirmationModal} from '@/shared/components/common/modals/ConfirmationModal';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {useFollowUpTaskActions} from '@/shared/hooks/useFollowUpTaskActions';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import useUnsavedChangesGuard from '@/shared/hooks/useUnsavedChangesGuard';
import {FollowUpChecklistRunnerProps} from '@/shared/interfaces/followUp';
import {buildPatientFromTask} from '@/shared/utils/followUpUtils';
import {getFullName} from '@/shared/utils/general';
import {
  buildPatientPanelFacts,
  buildPatientIdentityLine,
} from '@/shared/utils/patientUtils';
import DesktopRunner from '@/views/pages/caregiverChecklist/DesktopRunner';
import PhoneRunner from '@/views/pages/caregiverChecklist/PhoneRunner';
import SummaryView from '@/views/pages/caregiverChecklist/SummaryView';
import useChecklistRunner from '@/views/pages/caregiverChecklist/useChecklistRunner';
import FollowUpCompleteDrawer from '@/views/pages/followUps/FollowUpDetails/FollowUpCompleteDrawer';

// The caregiver's question-by-question runner, driving a follow-up task: the
// summary's send opens the complete drawer, and the answers travel with the
// outcome, notes and evidence in the one completion request.
const FollowUpChecklistRunnerView = ({
  task,
  questions,
  seededAnswers,
}: FollowUpChecklistRunnerProps) => {
  const {t} = useTranslation();
  const {push} = useLocaleRouter();
  const isDesktop = useIsDesktop();

  const detailUrl = DASHBOARD_ROUTES.followUps.single({id: task.id});

  const {modals, handlers, pending} = useFollowUpTaskActions({
    id: task.id,
    onCompleted: () => push({url: detailUrl}),
  });

  // Answers and photos from the summary, kept until the drawer sends them.
  const [answersFormData, setAnswersFormData] = useState<FormData | null>(null);

  const runner = useChecklistRunner({
    questions,
    seededAnswers,
    onSubmit: ({formData}) => {
      setAnswersFormData(formData);
      handlers.onComplete();
    },
  });

  // Nothing is saved until the task is completed, so leaving always asks.
  const {isConfirmOpen, requestClose, confirmClose, cancelClose} =
    useUnsavedChangesGuard({
      isDirty: true,
      isLoading: pending.isCompleting,
      onClose: () => push({url: detailUrl}),
    });

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', warn);

    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  // A fresh copy per send, so a retry never doubles the outcome fields.
  const buildFormData = () => {
    const formData = new FormData();
    answersFormData?.forEach((value, key) => formData.append(key, value));

    return formData;
  };

  // The same patient panel the caregiver's run shows: age and county by the
  // name, then date of birth, gender, phone, email, county and region.
  const patient = buildPatientFromTask({task});

  const viewProps = {
    runner,
    patientName: getFullName({
      firstName: patient.firstName,
      lastName: patient.lastName,
    }),
    patientDetail: buildPatientIdentityLine({
      patient,
      parts: ['age', 'county'],
    }),
    patientFacts: buildPatientPanelFacts({patient, t}),
    checklistName: task.checklistTemplate?.title || task.title,
    assignmentNote: task.description || '',
    isSubmitting: pending.isCompleting,
    onSaveAndExit: requestClose,
    submitLabel: t('followUps.actions.complete'),
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

      <FollowUpCompleteDrawer
        key={String(modals.completeModal.isModalOpen)}
        task={task}
        isOpen={modals.completeModal.isModalOpen}
        onClose={modals.completeModal.closeModal}
        onSubmit={({values, files}) =>
          handlers.submitComplete({values, files, formData: buildFormData()})
        }
        isLoading={pending.isCompleting}
      />

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

export default FollowUpChecklistRunnerView;
