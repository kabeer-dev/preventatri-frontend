'use client';

import {useMemo, useState} from 'react';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import RecordHeaderActions from '@/shared/components/common/headers/RecordHeaderActions';
import FlagCaseDetailsModal from '@/shared/components/common/modals/FlagCaseDetailsModal';
import {EMERGENCY_FLAG_FILTERS, FLAG_TYPES} from '@/shared/constants/flag';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {
  PATIENT_DRAWER_STEPS,
  PATIENT_VIEW_VARIANT,
} from '@/shared/constants/patients';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import {useModal} from '@/shared/hooks/modals/useModal';
import useCaregiverChecklists from '@/shared/hooks/useCaregiverChecklists';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {PatientDetailsProps} from '@/shared/interfaces/patientDetails';
import {useRegisterCurrentPatient} from '@/shared/providers/CaregiverRedFlagProvider';
import {assessmentQueries, patientQueries} from '@/shared/reactQuery';
import {useQueries as useFlagQueries} from '@/shared/reactQuery/flags/queries';
import {PatientDrawerStep} from '@/shared/types/patient';
import {getFullName} from '@/shared/utils/general';
import {
  isPatientAssignable,
  transformPatientResponse,
} from '@/shared/utils/patientUtils';
import ArchivePatientDialog from '@/views/pages/patients/ArchivePatientDialog';
import PatientDrawer from '@/views/pages/patients/PatientDrawer';

import PatientDetailsSkeleton from './PatientDetailsSkeleton';
import PatientDetailsUI from './PatientDetailsUI';

export default function PatientDetails({patientId}: PatientDetailsProps) {
  const {t} = useTranslation();
  const {useFetchPatient} = patientQueries();
  const {useFetchSubmission} = assessmentQueries();
  const {isCaregiver, isAdmin, isEmployee} = useUserRole();
  const {useFetchPatientActiveFlag} = useFlagQueries();
  const {currentUser} = useGetLoggedInUser();
  const router = useLocaleRouter();

  const {
    data,
    isLoading,
    isError,
    refetch: refetchPatient,
  } = useFetchPatient({id: patientId});

  // Scoped to this patient: the unscoped endpoint only returns the oldest flag
  // across all patients, so only the first-raised patient's page matched.
  const {data: activeFlagsData} = useFetchPatientActiveFlag({
    params: {patientId, type: EMERGENCY_FLAG_FILTERS.YELLOW},
    enabled: !isCaregiver,
  });

  // A red flag raised from this page is about this same patient.
  useRegisterCurrentPatient({
    id: patientId,
    name: getFullName({
      firstName: data?.patient?.firstName,
      lastName: data?.patient?.lastName,
    }),
  });

  // Only the caregiver's reading carries her work for this patient.
  const {
    late,
    dueToday,
    sentToday,
    upcoming,
    isLoading: isChecklistsLoading,
    isError: isChecklistsError,
    refetch: refetchChecklists,
  } = useCaregiverChecklists({patientId, enabled: isCaregiver});

  // Everything this patient owes, work first and what is already sent last.
  const checklists = useMemo(
    () => [...late, ...dueToday, ...upcoming, ...sentToday],
    [dueToday, late, sentToday, upcoming]
  );

  // The note belongs to the assignment, and only the single-submission
  // endpoint carries it, so it is read from the checklist this visit is about.
  const noteSource = late[0] || dueToday[0] || upcoming[0];

  const {data: submissionData} = useFetchSubmission({
    id: noteSource?.id || '',
    enabled: isCaregiver && Boolean(noteSource?.id),
    params: {...SUB_ROUTE_PARAMS},
  });

  const {isModalOpen, openModal, closeModal} = useModal();

  const {
    isModalOpen: isPatientDrawerOpen,
    openModal: openPatientDrawer,
    closeModal: closePatientDrawer,
  } = useModal();

  const {
    isModalOpen: isArchiveModalOpen,
    openModal: openArchiveModal,
    closeModal: closeArchiveModal,
  } = useModal();

  const [drawerStep, setDrawerStep] = useState<PatientDrawerStep>(
    PATIENT_DRAWER_STEPS.careTeam
  );

  const openDrawerAt = ({step}: {step: PatientDrawerStep}) => {
    setDrawerStep(step);
    openPatientDrawer();
  };

  const canEditAssignments = isAdmin || isEmployee;

  const rawPatient = data?.patient;

  const patient = useMemo(
    () => (rawPatient ? transformPatientResponse({patient: rawPatient}) : null),
    [rawPatient]
  );

  if (isLoading || (isCaregiver && isChecklistsLoading)) {
    return <PatientDetailsSkeleton />;
  }

  // The caregiver's work for this patient is the point of her page, so a
  // failed checklist list is as much a failure as a missing record.
  if (!patient || isError || (isCaregiver && isChecklistsError)) {
    return (
      <ContentNotAvailable
        title={t('patients.notFoundTitle')}
        message={t('patients.notFoundMessage')}
        {...(isCaregiver && {
          onBack: () => {
            refetchPatient();
            refetchChecklists();
          },
          backButtonText: t('caregiverPortal.error.retry'),
        })}
      />
    );
  }

  if (isCaregiver) {
    return (
      <PatientDetailsUI
        patient={patient}
        variant={PATIENT_VIEW_VARIANT.caregiver}
        checklists={checklists}
        assignmentNote={submissionData?.submission?.assignment?.notes || ''}
        assignmentNoteChecklist={noteSource?.checklistName || ''}
        nextToStart={late[0] || dueToday[0]}
        caregiverName={getFullName({
          firstName: currentUser?.firstName,
          lastName: currentUser?.lastName,
        })}
      />
    );
  }

  const activeFlag = activeFlagsData?.flag;

  const activeYellowFlag =
    activeFlag?.flagType === FLAG_TYPES.YELLOW &&
    activeFlag.patientId === patientId
      ? activeFlag
      : undefined;

  // Matches the list, which offers no row actions on an archived patient.
  const canManagePatient = canEditAssignments && !patient.archived;

  return (
    <>
      {canManagePatient && (
        <RecordHeaderActions
          onEdit={() => openDrawerAt({step: PATIENT_DRAWER_STEPS.details})}
          onRemove={openArchiveModal}
          removeAction='archive'
        />
      )}
      <PatientDetailsUI
        patient={patient}
        activeYellowFlag={activeYellowFlag}
        onDispatch={activeYellowFlag ? openModal : undefined}
        onAssignCaregiver={
          canEditAssignments
            ? () => openDrawerAt({step: PATIENT_DRAWER_STEPS.careTeam})
            : undefined
        }
        isAssignCaregiverDisabled={
          !isPatientAssignable({
            status: patient.status,
            archived: patient.archived,
          })
        }
      />
      {canEditAssignments && (
        <PatientDrawer
          isOpen={isPatientDrawerOpen}
          onClose={closePatientDrawer}
          patient={patient}
          initialStep={drawerStep}
          onSaved={refetchPatient}
        />
      )}
      {canManagePatient && (
        <ArchivePatientDialog
          isOpen={isArchiveModalOpen}
          patient={patient}
          onClose={closeArchiveModal}
          onArchived={() => router.push({url: DASHBOARD_ROUTES.patients.all()})}
        />
      )}
      {activeYellowFlag && (
        <FlagCaseDetailsModal
          flag={activeYellowFlag}
          isOpen={isModalOpen}
          onClose={closeModal}
          onResolve={closeModal}
        />
      )}
    </>
  );
}
