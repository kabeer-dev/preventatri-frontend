'use client';

import {useEffect, useState} from 'react';

import {ConfirmationModal} from '@/shared/components/common/modals/ConfirmationModal';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import {useSupervisoryVisitActions} from '@/shared/hooks/useSupervisoryVisitActions';
import useTranslation from '@/shared/hooks/useTranslation';
import useUnsavedChangesGuard from '@/shared/hooks/useUnsavedChangesGuard';
import useUserRole from '@/shared/hooks/useUserRole';
import {SupervisoryVisitChecklistRunnerProps} from '@/shared/interfaces/supervisoryVisit';
import {getFullName} from '@/shared/utils/general';
import {
  buildPatientPanelFacts,
  buildPatientIdentityLine,
} from '@/shared/utils/patientUtils';
import {getFilingCopyKeys} from '@/shared/utils/supervisoryVisitUtils';
import {buildPatientFromWorkItem} from '@/shared/utils/workItemUtils';
import DesktopRunner from '@/views/pages/caregiverChecklist/DesktopRunner';
import PhoneRunner from '@/views/pages/caregiverChecklist/PhoneRunner';
import SummaryView from '@/views/pages/caregiverChecklist/SummaryView';
import useChecklistRunner from '@/views/pages/caregiverChecklist/useChecklistRunner';
import SupervisoryVisitCompleteDrawer from '@/views/pages/supervisoryVisits/SupervisoryVisitDetails/SupervisoryVisitCompleteDrawer';

// The caregiver's question-by-question runner, driving a supervisory visit:
// the summary's send opens the filing drawer, and the answers travel with the
// outcome, findings, evidence and queued follow-ups in the one request.
const SupervisoryVisitChecklistRunnerView = ({
  visit,
  questions,
  seededAnswers,
}: SupervisoryVisitChecklistRunnerProps) => {
  const {t} = useTranslation();
  const {push} = useLocaleRouter();
  const {isAdmin} = useUserRole();
  const isDesktop = useIsDesktop();

  const detailUrl = DASHBOARD_ROUTES.supervisoryVisits.single({id: visit.id});

  const {modals, handlers, pending} = useSupervisoryVisitActions({
    id: visit.id,
    onFiled: () => push({url: detailUrl}),
  });

  // Answers and photos from the summary, kept until the drawer sends them.
  const [answersFormData, setAnswersFormData] = useState<FormData | null>(null);

  const runner = useChecklistRunner({
    questions,
    seededAnswers,
    onSubmit: ({formData}) => {
      setAnswersFormData(formData);
      handlers.onFile();
    },
  });

  // Nothing is saved until the visit is filed, so leaving always asks.
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

  const patient = buildPatientFromWorkItem({
    patientId: visit.patientId,
    patient: visit.patient,
  });

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
    checklistName:
      visit.checklistTemplate?.title || t('supervisoryVisits.detail.checklist'),
    assignmentNote: visit.description || '',
    isSubmitting: pending.isCompleting,
    onSaveAndExit: requestClose,
    submitLabel: t(getFilingCopyKeys({isAdmin}).action),
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

      <SupervisoryVisitCompleteDrawer
        key={String(modals.completeModal.isModalOpen)}
        visit={visit}
        isOpen={modals.completeModal.isModalOpen}
        onClose={modals.completeModal.closeModal}
        onSubmit={({values, files, queuedFollowUps}) =>
          handlers.submitComplete({
            values,
            files,
            queuedFollowUps,
            formData: buildFormData(),
          })
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

export default SupervisoryVisitChecklistRunnerView;
