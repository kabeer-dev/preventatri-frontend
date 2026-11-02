import {useMemo} from 'react';

import {NURSE_REGION_ROLES} from '@/shared/constants/nurses';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import {useNurseSelectOptions} from '@/shared/hooks/useNurseSelectOptions';
import {
  UsePatientNurseOptionsParams,
  UsePatientNurseOptionsResult,
} from '@/shared/interfaces/nurse';

// The patient's primary and secondary nurse pickers, each limited to nurses
// holding that role in the region of the chosen county.
const usePatientNurseOptions = ({
  selectedRegionId,
  isOpen,
  savedNurseOptions,
}: UsePatientNurseOptionsParams): UsePatientNurseOptionsResult => {
  const enabled = Boolean(isOpen && selectedRegionId);

  const primaryParams = useMemo(
    () => ({
      regionId: selectedRegionId,
      nurseRegionRole: NURSE_REGION_ROLES.PRIMARY,
      ...SUB_ROUTE_PARAMS,
    }),
    [selectedRegionId]
  );

  const secondaryParams = useMemo(
    () => ({
      regionId: selectedRegionId,
      nurseRegionRole: NURSE_REGION_ROLES.SECONDARY,
      ...SUB_ROUTE_PARAMS,
    }),
    [selectedRegionId]
  );

  const primaryNurseSource = useNurseSelectOptions({
    params: primaryParams,
    enabled,
    seedOptions: savedNurseOptions,
  });

  const secondaryNurseSource = useNurseSelectOptions({
    params: secondaryParams,
    enabled,
    seedOptions: savedNurseOptions,
  });

  return {primaryNurseSource, secondaryNurseSource};
};

export default usePatientNurseOptions;
