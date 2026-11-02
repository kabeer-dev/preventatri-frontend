import {useEffect, useMemo, useRef} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, useWatch} from 'react-hook-form';

import {useCaseManagerSelectOptions} from '@/shared/hooks/useCaseManagerSelectOptions';
import usePatientNurseOptions from '@/shared/hooks/usePatientNurseOptions';
import useTranslation from '@/shared/hooks/useTranslation';
import {SelectOption} from '@/shared/interfaces/inputs';
import {UsePatientDetailsFormParams} from '@/shared/interfaces/patient';
import {patientFormSchema} from '@/shared/schemas/patient';
import {PatientFormPayload} from '@/shared/types/patient';
import {
  generatePatientFormDefaults,
  isHhaManagedPatient,
  isPatientPrimaryNurseLocked,
} from '@/shared/utils/patientUtils';

const usePatientDetailsForm = ({
  isOpen,
  patient,
  countySource,
}: UsePatientDetailsFormParams) => {
  const {ct} = useTranslation();

  const form = useForm<PatientFormPayload>({
    resolver: zodResolver(ct({constant: patientFormSchema})),
    defaultValues: generatePatientFormDefaults({patient}),
  });

  const {control, reset, setValue} = form;

  const selectedCountyId = useWatch({control, name: 'county'});
  const status = useWatch({control, name: 'status'});

  const selectedCounty = useMemo(
    () =>
      selectedCountyId
        ? (countySource.findOption({value: selectedCountyId}) ?? null)
        : null,
    [countySource, selectedCountyId]
  );

  const selectedRegionId = selectedCounty?.regionId || '';

  // Nurse picks are cleared only when the region actually changes, not when
  // an existing patient's values are first loaded.
  const previousRegionIdRef = useRef<string>('');

  useEffect(() => {
    if (!selectedCountyId) {
      setValue('assignedRegion', '');
    } else if (selectedCounty) {
      setValue('assignedRegion', selectedCounty.regionName);
    }
  }, [selectedCountyId, selectedCounty, setValue]);

  // A primary nurse HHAeXchange named stays regardless of region; an admin's pick does not.
  const isPrimaryNurseLocked = isPatientPrimaryNurseLocked({patient});

  useEffect(() => {
    const previousRegionId = previousRegionIdRef.current;

    if (previousRegionId && previousRegionId !== selectedRegionId) {
      if (!isPrimaryNurseLocked) setValue('primaryNurseProfileId', '');

      setValue('secondaryNurseProfileId', '');
    }

    previousRegionIdRef.current = selectedRegionId;
  }, [selectedRegionId, setValue, isPrimaryNurseLocked]);

  const wasOpenRef = useRef(false);

  useEffect(() => {
    const isOpening = isOpen && !wasOpenRef.current;

    wasOpenRef.current = isOpen;

    if (!isOpening) return;

    reset(generatePatientFormDefaults({patient}));
    previousRegionIdRef.current = '';
  }, [isOpen, reset, patient]);

  const savedNurseOptions = useMemo(
    () =>
      [
        {
          value: patient?.primaryNurseProfileId,
          label: patient?.primaryNurseName,
        },
        {
          value: patient?.secondaryNurseProfileId,
          label: patient?.secondaryNurseName,
        },
      ].filter((option): option is SelectOption =>
        Boolean(option.value && option.label)
      ),
    [patient]
  );

  const {primaryNurseSource, secondaryNurseSource} = usePatientNurseOptions({
    selectedRegionId,
    isOpen,
    savedNurseOptions,
  });

  const savedCaseManagerOptions = useMemo(
    () =>
      patient?.caseManager?.id && patient.caseManagerName
        ? [{value: patient.caseManager.id, label: patient.caseManagerName}]
        : [],
    [patient]
  );

  // Only an HHAeXchange patient's case manager is picked on the patient.
  const caseManagerSource = useCaseManagerSelectOptions({
    enabled: isOpen && isHhaManagedPatient({patient}),
    seedOptions: savedCaseManagerOptions,
  });

  return {
    form,
    status,
    selectedCounty,
    primaryNurseSource,
    secondaryNurseSource,
    caseManagerSource,
  };
};

export default usePatientDetailsForm;
