'use client';

import {useMemo, useState} from 'react';

import HhaSyncAction from '@/shared/components/common/HhaSyncAction';
import {LIST_TYPES} from '@/shared/constants/general';
import {
  PATIENT_LIST_TABS,
  PATIENT_READ_ONLY_LIST_TABS,
} from '@/shared/constants/listToolbarTabs';
import {
  PATIENT_ARCHIVE_FILTER,
  PATIENT_DRAWER_STEPS,
  PATIENT_LIST_PARAMS,
  PATIENT_TABLE_VIEW_PARAMS,
  PATIENT_VIEW_VARIANT,
} from '@/shared/constants/patients';
import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useModal} from '@/shared/hooks/modals/useModal';
import useCaregiverChecklists from '@/shared/hooks/useCaregiverChecklists';
import {useListTabs} from '@/shared/hooks/useListTabs';
import {usePatientListFilters} from '@/shared/hooks/usePatientListFilters';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {CaregiverWorkloadStatus} from '@/shared/interfaces/caregiverChecklist';
import {Patient, PatientsTableProps} from '@/shared/interfaces/patient';
import {patientQueries} from '@/shared/reactQuery';
import {PatientDrawerStep} from '@/shared/types/patient';
import {groupWorkloadByPatient} from '@/shared/utils/caregiverChecklists';
import {transformPatientResponse} from '@/shared/utils/patientUtils';
import ArchivePatientDialog from '@/views/pages/patients/ArchivePatientDialog';
import PatientDrawer from '@/views/pages/patients/PatientDrawer';

import PatientsTableUI from './PatientsTableUI';

/**
 * Smart component for the PatientsTable
 * Fetches data with server-side pagination and handles business logic
 */

const PatientsTable = ({
  isReadOnly = false,
  addButtonText,
  title,
  variant = PATIENT_VIEW_VARIANT.admin,
}: PatientsTableProps) => {
  const {t} = useTranslation();
  const {isAdmin} = useUserRole();
  const resolvedAddButtonText = addButtonText || t('patients.table.addButton');

  const isCaregiverView = variant === PATIENT_VIEW_VARIANT.caregiver;

  // The HHAeXchange import rewrites demographics for every imported patient in
  // the organization, so it is admin-only — matching the backend ACL.
  const canSyncHhaExchange = isAdmin && !isReadOnly;

  const {tabs, tabParams} = useListTabs({
    urlKey: PATIENT_LIST_PARAMS.archiveFilter,
    ariaLabel: t('patients.table.filterArchiveLabel'),
    options: isReadOnly ? PATIENT_READ_ONLY_LIST_TABS : PATIENT_LIST_TABS,
    defaultValue: PATIENT_ARCHIVE_FILTER.all,
  });

  const {filterParams, toolbarFilters} = usePatientListFilters({
    enabled: !isCaregiverView,
  });

  // Queries — server-side filtered list
  const {useFetchPatientsList, useFetchPatient} = patientQueries();

  const {
    filteredData: rawPatients,
    isLoading,
    reactQueryData,
    tablePaginationProps,
    filters: {search},
    setFilters,
  } = useServerSideListFilters<Patient>({
    listType: LIST_TYPES.patients,
    queryToCall: useFetchPatientsList,
    dataKey: LIST_TYPES.patients.value,
    baseParams: {...tabParams, ...filterParams, ...PATIENT_TABLE_VIEW_PARAMS},
  });

  // Only the caregiver's table shows what is due, so only it asks for her
  // checklists. The server scopes that list to her already.
  const {
    checklists,
    isLoading: isWorkloadLoading,
    isError: isWorkloadError,
    refetch: refetchWorkload,
  } = useCaregiverChecklists({enabled: isCaregiverView});

  // An empty list means nothing due only once the request has answered.
  const workloadStatus: CaregiverWorkloadStatus = isWorkloadLoading
    ? 'loading'
    : isWorkloadError
      ? 'error'
      : 'ready';

  const workload = useMemo(
    () => groupWorkloadByPatient({checklists}),
    [checklists]
  );

  // Transform backend response shape to match Patient interface
  const patients = rawPatients.map((patient: any) =>
    transformPatientResponse({patient})
  );

  // Patient modal state (Add/Edit)
  const {
    isModalOpen: isPatientModalOpen,
    closeModal: closePatientModal,
    openModal: openPatientModal,
  } = useModal();

  // Delete modal state
  const {
    isModalOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    openModal: openDeleteModal,
  } = useModal();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // The table rows carry only what the table shows, so Edit fetches the full
  // record and the drawer opens once it arrives.
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // The step the drawer opens on: details for Edit, care team for its shortcut.
  const [editingStep, setEditingStep] = useState<PatientDrawerStep>(
    PATIENT_DRAWER_STEPS.details
  );

  const resetEditing = () => {
    setEditingPatientId(null);
    setEditingPatient(null);
    setEditingStep(PATIENT_DRAWER_STEPS.details);
  };

  const {data: editData, isFetching: isEditFetching} = useFetchPatient({
    id: editingPatientId || '',
    enabled: Boolean(editingPatientId),
    callBackFuncs: {
      onError: () => {
        closePatientModal();
        resetEditing();
      },
    },
  });

  // Held once loaded, so a background refetch after a save does not close the
  // drawer mid-edit.
  const fetchedPatient = editData?.patient;

  if (
    editingPatientId &&
    !editingPatient &&
    !isEditFetching &&
    fetchedPatient?.id === editingPatientId
  ) {
    setEditingPatient(transformPatientResponse({patient: fetchedPatient}));
  }

  const isEditPending = Boolean(editingPatientId) && !editingPatient;

  const handleAddPatient = () => {
    resetEditing();
    openPatientModal();
  };

  const openEditDrawer = ({
    id,
    step,
  }: {
    id: string;
    step: PatientDrawerStep;
  }) => {
    setEditingPatient(null);
    setEditingPatientId(id);
    setEditingStep(step);
    openPatientModal();
  };

  const handleEditPatient = ({id}: {id: string}) =>
    openEditDrawer({id, step: PATIENT_DRAWER_STEPS.details});

  const handleEditCareTeam = ({id}: {id: string}) =>
    openEditDrawer({id, step: PATIENT_DRAWER_STEPS.careTeam});

  const handleDeletePatient = ({id}: {id: string}) => {
    const patient = patients.find((p) => p.id === id);
    if (patient) {
      setSelectedPatient(patient);
      openDeleteModal();
    }
  };

  const clearSelectedPatient = () => {
    setTimeout(() => {
      setSelectedPatient(null);
    }, POST_MODAL_CLEANUP_DELAY);
  };

  const handleCancelDelete = () => {
    closeDeleteModal();
    clearSelectedPatient();
  };

  const handleClosePatientModal = () => {
    closePatientModal();
    setTimeout(resetEditing, POST_MODAL_CLEANUP_DELAY);
  };

  return (
    <>
      <PatientsTableUI
        patients={patients}
        isLoading={isLoading || reactQueryData.isFetching}
        showAddButton={!isReadOnly && !isCaregiverView}
        readOnly={isReadOnly}
        addButtonText={resolvedAddButtonText}
        title={title}
        variant={variant}
        workload={workload}
        workloadStatus={workloadStatus}
        onRetryWorkload={() => refetchWorkload()}
        toolbar={{
          tabs,
          search: {
            value: search,
            onChange: ({val}) => setFilters({search: val}),
            placeholder: t('patients.table.searchPlaceholder'),
          },
          filters: toolbarFilters,
        }}
        paginationProps={tablePaginationProps}
        onAddPatient={handleAddPatient}
        onEditPatient={handleEditPatient}
        onEditCareTeam={handleEditCareTeam}
        onDeletePatient={handleDeletePatient}
        editLoadingId={isEditPending ? editingPatientId : null}
        editLoadingStep={editingStep}
        actionSlot={
          canSyncHhaExchange && !isCaregiverView ? <HhaSyncAction /> : undefined
        }
      />
      {!isReadOnly && (
        <>
          <PatientDrawer
            isOpen={isPatientModalOpen && !isEditPending}
            onClose={handleClosePatientModal}
            patient={editingPatient}
            initialStep={editingStep}
          />

          <ArchivePatientDialog
            isOpen={isDeleteModalOpen}
            patient={selectedPatient}
            onClose={handleCancelDelete}
            onArchived={handleCancelDelete}
          />
        </>
      )}
    </>
  );
};

export default PatientsTable;
