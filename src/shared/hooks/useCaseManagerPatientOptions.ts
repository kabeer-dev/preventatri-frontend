'use client';

import {useEffect} from 'react';

import {
  CaseManagerSelectOption,
  UseCaseManagerPatientOptionsParams,
} from '@/shared/interfaces/caseManager';
import {caseManagerQueries} from '@/shared/reactQuery';

/**
 * Options for the case manager form's Assigned Patients field.
 *
 * The region-scoped available-patients list, refetched as the admin changes
 * regions, with the current selection pruned to whatever is still valid for
 * those regions. Extracted from CaseManagerModal so the container stays under
 * the 200-line cap; the behaviour is unchanged.
 */
export const useCaseManagerPatientOptions = ({
  isOpen,
  isEditMode,
  caseManager,
  assignedRegions,
  currentPatientIds,
  setValue,
}: UseCaseManagerPatientOptionsParams): CaseManagerSelectOption[] => {
  const {useFetchAvailablePatients} = caseManagerQueries();

  const hasRegions = Boolean(assignedRegions?.length);

  const fetchParams = hasRegions
    ? Object.assign(
        {regionIds: (assignedRegions || []).join(',')},
        isEditMode && caseManager?.id
          ? {caseManagerProfileId: caseManager.id}
          : {}
      )
    : undefined;

  const {
    data: availablePatientsData,
    isLoading: isPatientsLoading,
    isPlaceholderData: isPatientsPlaceholder,
  } = useFetchAvailablePatients({
    params: fetchParams,
    enabled: isOpen && hasRegions,
  });

  const patientOptions: CaseManagerSelectOption[] =
    availablePatientsData?.patients || [];

  // Remove patientIds that are no longer valid for the selected regions.
  // Guarded by isPatientsLoading AND isPatientsPlaceholder so it never runs
  // against stale options: with keepPreviousData, switching to another case
  // manager keeps the previous CM's patients as placeholder while isLoading is
  // false — filtering against those would wipe the newly selected CM's
  // pre-assigned patients until the fetch resolves.
  useEffect(() => {
    if (
      isPatientsLoading ||
      isPatientsPlaceholder ||
      !currentPatientIds?.length ||
      !assignedRegions
    )
      return;

    const validPatientIds = new Set(patientOptions.map((p) => p.value));
    const filtered = currentPatientIds.filter((id) => validPatientIds.has(id));

    if (filtered.length !== currentPatientIds.length) {
      setValue('patientIds', filtered);
    }
  }, [assignedRegions, isPatientsLoading, isPatientsPlaceholder]); // eslint-disable-line react-hooks/exhaustive-deps

  return patientOptions;
};
