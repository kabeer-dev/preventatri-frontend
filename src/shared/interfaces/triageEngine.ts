import {ServerSideTablePaginationProps} from '@/shared/interfaces/hooks';
import {ListToolbarProps} from '@/shared/interfaces/listToolbar';

export type TriageSeverity = 'red' | 'yellow' | 'green';

// Raw enum values from the backend; the frontend maps them to titles/colors.
export type TriageFlagEnum = 'RED' | 'YELLOW' | 'GREEN';

export type TriageFlagType = 'AUTO' | 'MANUAL';

export interface TriagePerson {
  firstName?: string | null;
  lastName?: string | null;
}

// Submission flag returned by /triage-engine/alerts. Raw enum values only —
// title and severity color are derived on the frontend.
export interface TriageAlert {
  id: string;
  flag: TriageFlagEnum;
  type: TriageFlagType;
  reason: number;
  status: string;
  createdAt: string;
  resolvedAt?: string | null;

  // When the escalation assignee accepted it; its timer stops there.
  acceptedAt?: string | null;

  // Present for AUTO alerts (linked to a checklist submission); null for MANUAL
  // alerts (caregiver-raised emergency flags tied to a patient only).
  submissionId?: string | null;
  patient?: TriagePerson | null;
  submitter?: TriagePerson | null;
}

export interface TriageEngineCounts {
  activeRedFlags: number;
  activeYellowFlags: number;
  greenFlags: number;
  slaBreaches?: number | null;
  stableLast30Days?: number | null;
}

// The triage stats endpoint returns the counts flat in the response body
// (activeRedFlags/activeYellowFlags/greenFlags), so the response type is the
// counts shape itself rather than a nested { data } wrapper.
export type TriageEngineStatsResponse = TriageEngineCounts;

export interface TriageAlertsParams {
  page: number;
  limit: number;
}

export interface TriageListMeta {
  page: number;
  limit: number;
  count: number;
  totalPages: number;
}

// Like the stats endpoint, this hook exposes the response body directly
// (useQueryHandler destructures `data` = body), so the shape is flat.
export interface TriageAlertsResponse {
  alerts: TriageAlert[];
  meta: TriageListMeta;
}

export interface AlertsTableProps {
  alerts: TriageAlert[];
  isLoading?: boolean;
  paginationProps: ServerSideTablePaginationProps;
  toolbar: ListToolbarProps;
}
