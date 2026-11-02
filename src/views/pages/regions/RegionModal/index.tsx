'use client';

import {useEffect, useMemo} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, useWatch} from 'react-hook-form';

import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import {useNurseSelectOptions} from '@/shared/hooks/useNurseSelectOptions';
import {useReferenceCountyOptions} from '@/shared/hooks/useReferenceCountyOptions';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  Region,
  RegionModalProps,
  RegionMutationPayload,
  RegionNurseRef,
} from '@/shared/interfaces/region';
import {regionFormSchema} from '@/shared/schemas/region';
import {RegionFormPayload} from '@/shared/types/region';
import {
  formatCountyLabel,
  getCountyOptionValue,
  toRegionCountyRef,
} from '@/shared/utils/countyUtils';
import {getFullName} from '@/shared/utils/general';

import RegionModalUI from './RegionModalUI';

const defaultValues: RegionFormPayload = {
  name: '',
  isActive: true,
  counties: [],
  primaryNurseProfileIds: [],
  secondaryNurseProfileIds: [],
};

const generateDefaultValue = ({
  region,
}: {
  region: Region;
}): RegionFormPayload => {
  return {
    name: region.name || '',
    isActive: region.isActive,
    counties:
      region.counties?.length > 0
        ? region.counties.map((county) => getCountyOptionValue({county}))
        : [],
    primaryNurseProfileIds: (region.primaryNurses || []).map(
      (nurse) => nurse.id
    ),
    secondaryNurseProfileIds: (region.secondaryNurses || []).map(
      (nurse) => nurse.id
    ),
  };
};

const RegionModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  region = null,
}: RegionModalProps) => {
  const {ct} = useTranslation();

  const isEditMode = Boolean(region);

  const {
    control,
    handleSubmit,
    reset,
    formState: {isDirty},
  } = useForm<RegionFormPayload>({
    resolver: zodResolver(ct({constant: regionFormSchema})),
    defaultValues,
  });

  // Reset form when modal opens - populate with region data if editing
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && region) reset(generateDefaultValue({region}));
      else reset(defaultValues);
    }
  }, [isOpen, reset, isEditMode, region]);

  const primaryNurseIds = useWatch({control, name: 'primaryNurseProfileIds'});

  const secondaryNurseIds = useWatch({
    control,
    name: 'secondaryNurseProfileIds',
  });

  // Saved nurses stay labelled even when the eligibility filter drops them.
  const savedNurseOptions = useMemo(
    () =>
      [
        ...(region?.primaryNurses ?? []),
        ...(region?.secondaryNurses ?? []),
      ].map((nurse: RegionNurseRef) => ({
        value: nurse.id,
        label: getFullName({
          firstName: nurse.user?.firstName,
          lastName: nurse.user?.lastName,
        }),
      })),
    [region]
  );

  // Saved counties stay labelled, including ones that are not in the US list.
  const savedCountyOptions = useMemo(
    () =>
      (region?.counties ?? []).map((county) => ({
        value: getCountyOptionValue({county}),
        label: formatCountyLabel(county),
      })),
    [region]
  );

  const countySource = useReferenceCountyOptions({
    enabled: isOpen,
    seedOptions: savedCountyOptions,
  });

  const primaryNurseSource = useNurseSelectOptions({
    enabled: isOpen,
    seedOptions: savedNurseOptions,
  });

  const secondaryNurseSource = useNurseSelectOptions({
    enabled: isOpen,
    seedOptions: savedNurseOptions,
  });

  const handleClose = () => {
    onClose();
    setTimeout(() => reset(defaultValues), POST_MODAL_CLEANUP_DELAY);
  };

  const handleFormSubmit = (data: RegionFormPayload) => {
    const payload: RegionMutationPayload = Object.assign({}, data, {
      counties: data.counties.map((value) => toRegionCountyRef({value})),
      primaryNurseProfileIds: data.primaryNurseProfileIds || [],
      secondaryNurseProfileIds: data.secondaryNurseProfileIds || [],
    });
    onSubmit(payload);
  };

  return (
    <RegionModalUI
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit(handleFormSubmit)}
      control={control}
      isLoading={isLoading}
      isEditMode={isEditMode}
      isDirty={isDirty}
      regionCode={region?.code}
      countySource={countySource}
      primaryNurseSource={primaryNurseSource}
      secondaryNurseSource={secondaryNurseSource}
      primaryNurseIds={primaryNurseIds || []}
      secondaryNurseIds={secondaryNurseIds || []}
    />
  );
};

export default RegionModal;
