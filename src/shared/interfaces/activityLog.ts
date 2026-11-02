import type {DashboardExportFormat} from '@/shared/interfaces/dashboard';
import type {ServerSideTablePaginationProps} from '@/shared/interfaces/hooks';
import type {DateTime} from '@/shared/utils/dateUtils';

export interface AuditLogRegion {
  name: string;
  county: string;
}

export interface AuditLogActor {
  id: string;
  name: string;
  role: string;

  // Null for actors not scoped to one region (e.g. an admin acting across
  // "all regions").
  region: AuditLogRegion | null;
}

export interface AuditLogOrigin {
  ipAddress?: string;
  device?: string;
  type?: string;
}

// One "what changed" line from the API. `type` is 'no-change' when the
// action didn't alter the record (e.g. a view), otherwise a field-change
// type; `title` and `description` are already formatted for display.
export interface AuditLogChange {
  type: string;
  title: string;
  description: string;
}

export interface AuditLogRelatedRecord {
  type: string;
  label: string;
  sublabel?: string;
  id: string;
}

export interface AuditLogEntry {
  id: string;
  resourceType: string;
  resourceLabel: string;
  action: string;
  description: string;
  timestamp: string;
  whatChanged: AuditLogChange[];
  actor: AuditLogActor;
  origin: AuditLogOrigin;

  // Omitted by the API for resource types that don't cross-link to other
  // records (e.g. a plain "patient viewed" read).
  relatedRecords?: AuditLogRelatedRecord[];
}

export interface AuditLogListMeta {
  page: number;
  limit: number;
  count: number;
  totalPages: number;
}

export interface AuditLogListResponse {
  auditLogs: AuditLogEntry[];
  meta: AuditLogListMeta;
  type: string;
}

// Export dialog form shape: dates come back from RHFDateField as a Luxon
// DateTime (or a plain string once submitted/serialized).
export interface AuditLogExportFormValues {
  fromDate: DateTime | string | null;
  toDate: DateTime | string | null;
  format: DashboardExportFormat;
}

export interface AuditLogExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AuditLogDayGroup {
  day: string;
  items: AuditLogEntry[];
}

export interface ActivityLogTableProps {
  logs: AuditLogEntry[];
  isLoading?: boolean;
  selectedLogId?: string;
  onSelectLog: ({log}: {log: AuditLogEntry}) => void;
  paginationProps?: ServerSideTablePaginationProps;
}
