import {ReactNode} from 'react';

import {FLAG_TYPES} from '@/shared/constants/flag';
import {ToolbarTableUIProps} from '@/shared/interfaces/tables';
import {RowAction} from '@/shared/types/tables';

// Flag colour as returned by the API (uppercase), e.g. 'RED' | 'YELLOW' | 'GREEN'.
export type EmergencyFlagColor = Uppercase<
  (typeof FLAG_TYPES)[keyof typeof FLAG_TYPES]
>;

export interface EmergencyFlagListItem {
  id: string;
  patientId: string;
  patientName: string;
  caregiverName: string;
  reason: number;
  flag: EmergencyFlagColor;
  status: string;
  description: string;
  createdAt: string;
  voidedAt: string | null;

  /** Not sent by the list API yet; resolved rows fall back to "N ago". */
  resolvedAt?: string | null;

  /** When the escalation assignee accepted it; its timer stops there. */
  acceptedAt?: string | null;
}

export interface FlagTimestampCellProps {
  date?: string | null;
}

export interface FlagRaisedCellProps {
  flag: EmergencyFlagListItem;

  /** Its age ("3 hours ago", stopping once accepted or resolved) instead of a timestamp. */
  relative: boolean;
}

export interface EmergencyFlagsTableUIProps extends ToolbarTableUIProps {
  emergencyFlags: EmergencyFlagListItem[];
  onEditEmergencyFlag?: RowAction;
  onVoidEmergencyFlag?: RowAction;
  hidePatientColumn?: boolean;
  hideCaregiverColumn?: boolean;
  alwaysShowCaregiverColumn?: boolean;
  hideActions?: boolean;
  noRowsLabel?: string;
  titleInCard?: boolean;

  /** Dashboard preview: reason column, relative "Raised", no status, voided or actions. */
  compact?: boolean;
  titleAction?: ReactNode;
}

export interface EmergencyFlagsListResponse {
  emergencyFlags: RawEmergencyFlagResponse[];
}

// Raw shape returned by the emergency-flags API before transformation.
export interface RawEmergencyFlagResponse {
  id: string;

  /** The list payload carries the id beside the embedded patient record. */
  patientId?: string;
  reason: number;
  flag: EmergencyFlagColor;
  status: string;
  description: string | null;
  createdAt: string;
  voidedAt: string | null;
  resolvedAt?: string | null;
  acceptedAt?: string | null;
  patient?: {firstName?: string; lastName?: string};
  submitter?: {firstName?: string; lastName?: string};
}

export interface GetEmergencyFlagColumnsOptions {
  onEdit?: RowAction;
  onVoid?: RowAction;
  showEdit?: boolean;
  showVoid?: boolean;
  showActions?: boolean;
  showPatient?: boolean;
  showCaregiver?: boolean;

  /** Caregivers never void, so their tables skip the Voided column. */
  showVoidedAt?: boolean;

  /** Every flag a caregiver raises is critical, so her table swaps the
   * severity column for what she wrote. */
  showSeverity?: boolean;
  showDescription?: boolean;

  /** What the description column is called; the caregiver's table names it
   * from her side of the conversation. */
  descriptionHeader?: string;

  /** Gives the reason its own column instead of a line under the patient. */
  splitReason?: boolean;
  showStatus?: boolean;

  /** "3 hours ago" instead of a full timestamp, for short dashboard lists. */
  relativeCreatedAt?: boolean;
  t: (key: string) => string;
}
