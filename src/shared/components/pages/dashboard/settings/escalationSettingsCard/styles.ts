import {radius} from '@/@core/theme/spacing';

// Handle, step number, then the fields. The column headers use the same
// template (and the row's 1px border + 12px padding) so they line up.
export const stepRowGridSx = {
  display: 'grid',
  gap: '8px',
  alignItems: 'start',
  gridTemplateColumns: '28px 26px minmax(0, 1fr)',
};

// Shared by a step's own fields and its region-nurse fallback row, so the
// fallback's read-only values sit under the fields they copy.
export const stepColumnsSx = {
  display: 'grid',
  gap: 1.5,
  alignItems: 'center',
  gridTemplateColumns: {
    xs: 'minmax(0, 1fr)',
    md: 'minmax(0, 1.4fr) minmax(0, 1fr) 190px 34px',
  },
};

export const readOnlyValueSx = {
  px: 1.5,
  py: 0.75,
  borderRadius: `${radius.sm}px`,
  bgcolor: 'action.hover',
  color: 'text.secondary',
};
