'use client';

import {GridSkeletonLoadingOverlayInner} from '@mui/x-data-grid/internals';

import {TABLE_PAGINATION} from '@/shared/constants/common';
import {DataTableSkeletonOverlayProps} from '@/shared/interfaces/uiComponents';

// The grid's own skeleton row count comes from the measured content and is 0
// while `rows` is empty, so the caller passes the selected page size instead.
const DataTableSkeletonOverlay = ({
  variant: _variant,
  noRowsVariant: _noRowsVariant,
  skeletonRowsCount = TABLE_PAGINATION.skeletonRows,
  ...overlayProps
}: DataTableSkeletonOverlayProps) => (
  <GridSkeletonLoadingOverlayInner
    {...overlayProps}
    skeletonRowsCount={skeletonRowsCount}
  />
);

export default DataTableSkeletonOverlay;
