import {Control} from 'react-hook-form';

import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {UserRef} from '@/shared/interfaces/common';
import {SegmentedTabsProps} from '@/shared/interfaces/inputs';
import {FormModalProps} from '@/shared/interfaces/modals';
import {EntityTableProps, TableUIProps} from '@/shared/interfaces/tables';
import {RegionFormPayload} from '@/shared/types/region';
import {RowAction} from '@/shared/types/tables';

// County entity interface
export interface County {
  id: string;
  name: string;

  // Both null on a county typed in before counties were picked from the US list.
  stateCode: string | null;
  fipsCode: string | null;
  regionId: string;
  organizationId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// A row of the US county reference list.
export interface ReferenceCounty {
  fipsCode: string;
  stateCode: string;
  name: string;
}

export interface CountyLabelParts {
  name: string;
  stateCode?: string | null;
}

export interface RegionCountySource {
  id: string;
  fipsCode?: string | null;
}

// How a region names one of its counties to the API: a picked US county by
// FIPS code, or a county it already has by id.
export interface RegionCountyRef {
  id?: string;
  fipsCode?: string;
}

// Lightweight nurse shape returned in Region.primaryNurses / Region.secondaryNurses
export interface RegionNurseRef {
  id: string;
  status?: string;
  user?: UserRef;
}

// Region entity interface
export interface Region {
  id: string;
  name: string;
  code: string;
  organizationId: string;
  isActive: boolean;
  isDeleted: string | null;

  /** True for an archived region, which is shown but cannot be changed. */
  archived?: boolean;
  createdAt: string;
  updatedAt: string;
  counties: County[];

  // A region's primary/secondary nurses (the NurseRegion roster). A region can
  // have multiple of each; a nurse holds at most one role per region.
  primaryNurses?: RegionNurseRef[];
  secondaryNurses?: RegionNurseRef[];
}

export interface RegionsListUIProps extends TableUIProps, EntityTableProps {
  regions: Region[];
  tabs?: SegmentedTabsProps;
  onAddRegion?: () => void;
  onEditRegion?: RowAction;
  onDeleteRegion?: RowAction;
}

export interface NurseCoverageRowProps {
  label: string;
  nurses?: RegionNurseRef[] | null;
}

export interface RegionCardProps {
  region: Region;

  /** True while the list reloads, when this card may still show old data. */
  disabled?: boolean;
  onEdit?: RowAction;
  onDelete?: RowAction;
}

export interface RegionModalUIProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  control: Control<RegionFormPayload>;
  isLoading?: boolean;
  isEditMode?: boolean;
  isDirty?: boolean;

  regionCode?: string;
  countySource: AsyncSelectSource;
  primaryNurseSource: AsyncSelectSource;
  secondaryNurseSource: AsyncSelectSource;
  primaryNurseIds: string[];
  secondaryNurseIds: string[];
}

export interface RegionStatusFieldProps {
  control: Control<RegionFormPayload>;
  disabled?: boolean;
}

// Shape sent to the create/update region API.
export interface RegionMutationPayload {
  name: string;
  isActive: boolean;
  counties: RegionCountyRef[];
  primaryNurseProfileIds: string[];
  secondaryNurseProfileIds: string[];
}

// Region modal component props
export interface RegionModalProps extends FormModalProps<RegionMutationPayload> {
  region?: Region | null;
}
