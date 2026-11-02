import {ReactNode} from 'react';

import {ThemeColor} from '@/@core/theme/types';
import {HHA_VISIT_STATUS, HHA_VISIT_TYPE} from '@/shared/constants/hhaVisits';
import {ServerSideTablePaginationProps} from '@/shared/interfaces/hooks';
import {ListToolbarProps} from '@/shared/interfaces/listToolbar';

export type HhaVisitStatus =
  (typeof HHA_VISIT_STATUS)[keyof typeof HHA_VISIT_STATUS]['value'];

export type HhaVisitType =
  (typeof HHA_VISIT_TYPE)[keyof typeof HHA_VISIT_TYPE]['value'];

/**
 * One imported HHAeXchange visit, exactly as GET /integration/visits returns
 * it. In HHAeXchange a schedule and a visit are the same record, so the row
 * carries both the planned window (scheduled*) and what actually happened
 * (actual* / evv*). Standalone: the name snapshots are display data, never
 * links into PreventaTri patients or caregivers. The HHAeXchange ids are
 * internal to the import and the API does not return them.
 */
export interface HhaVisit {
  id: string;
  organizationId: string;
  patientFirstName: string | null;
  patientLastName: string | null;
  caregiverFirstName: string | null;
  caregiverLastName: string | null;
  visitDate: string;
  visitType: HhaVisitType | null;
  timeZone: string | null;
  status: HhaVisitStatus;
  scheduledStartAt: string | null;
  scheduledEndAt: string | null;
  scheduleDurationMinutes: number | null;
  actualStartAt: string | null;
  actualEndAt: string | null;
  evvStartAt: string | null;
  evvEndAt: string | null;
  clockInEvvType: string | null;
  clockOutEvvType: string | null;
  isMissedVisit: boolean;
  missedReasonId: number | null;
  missedReason: string | null;
  hhaDeletedAt: string | null;
  hhaDeletedReason: string | null;
  hhaModifiedDate: string | null;
  hhaLastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HhaVisitsTableProps {
  title?: string;
}

export interface HhaVisitsTableUIProps {
  visits: HhaVisit[];
  isLoading?: boolean;
  paginationProps?: ServerSideTablePaginationProps;
  toolbar?: ListToolbarProps;
  actionSlot?: ReactNode;
  onRowClick: ({visit}: {visit: HhaVisit}) => void;
  title?: string;
}

export interface HhaVisitCellType {
  row: HhaVisit;
}

export interface GetHhaVisitColumnsOptions {
  t: (key: string) => string;
}

export interface HhaVisitDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: HhaVisit | null;
}

/** One label/value line of the detail dialog. Values are plain strings. */
export interface HhaVisitDetailRow {
  label: string;
  value: string;
}

export interface HhaVisitDetailSection {
  title: string;
  rows: HhaVisitDetailRow[];
}

export interface HhaVisitDetailSectionProps {
  section: HhaVisitDetailSection;
}

export interface HhaVisitChip {
  label: string;
  color: ThemeColor;
}

export interface HhaVisitNameParts {
  firstName: string | null;
  lastName: string | null;
}

/** An ISO instant to format in the visit's own zone (HHAeXchange label). */
export interface HhaVisitInstant {
  date: string | null;
  timeZone: string | null;
}

export interface HhaVisitWindow {
  start: string | null;
  end: string | null;
  timeZone: string | null;
}

export interface HhaVisitDetailSectionsInput {
  visit: HhaVisit;
  t: (key: string) => string;
}
