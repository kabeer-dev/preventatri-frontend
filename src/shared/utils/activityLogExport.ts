import {ACTIVITY_LOG_EXPORT} from '@/shared/constants/activityLog';
import {DASHBOARD_EXPORT_FORMATS} from '@/shared/constants/dashboard';
import {AUDIT_LOGS} from '@/shared/constants/reactQueryConstants';
import {
  AuditLogEntry,
  AuditLogListResponse,
} from '@/shared/interfaces/activityLog';
import {
  DashboardExportFormat,
  DashboardExportTable,
} from '@/shared/interfaces/dashboard';
import {getAuditLogActionLabel} from '@/shared/utils/activityLogUtils';
import {exportDashboardData} from '@/shared/utils/dashboardExport';
import {formatDate} from '@/shared/utils/dateUtils';
import {getRequest} from '@/shared/utils/requests';

// Pages through the audit log list endpoint for one date range, accumulating
// every row -- the export covers the full range, not just what's on screen.
const fetchAllAuditLogsInRange = async ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}): Promise<AuditLogEntry[]> => {
  const logs: AuditLogEntry[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const endpoint = AUDIT_LOGS.fetchAuditLogsList.endpoint({
      params: {fromDate, toDate, page, limit: ACTIVITY_LOG_EXPORT.pageSize},
    });

    const response = await getRequest<{body: AuditLogListResponse}>({
      endpoint,
    });
    const {auditLogs, meta} = response.data.body;

    logs.push(...auditLogs);
    totalPages = meta.totalPages;
    page += 1;
  } while (page <= totalPages);

  return logs;
};

const asCsvText = ({value}: {value: string}): string => `'${value}`;

const buildAuditLogExportTable = ({
  logs,
  format,
  t,
}: {
  logs: AuditLogEntry[];
  format: DashboardExportFormat;
  t: (key: string) => string;
}): DashboardExportTable => ({
  title: t('activityLog.export.title'),
  head: [
    t('activityLog.table.headers.timestamp'),
    t('activityLog.export.columns.actor'),
    t('activityLog.export.columns.role'),
    t('activityLog.table.headers.action'),
    t('activityLog.export.columns.resource'),
    t('activityLog.export.columns.description'),
    t('activityLog.export.columns.ipAddress'),
    t('activityLog.export.columns.device'),
  ],
  body: logs.map((log) => {
    const timestamp = formatDate({
      date: log.timestamp,
      format: 'yyyy-LL-dd HH:mm:ss',
    });

    return [
      format === DASHBOARD_EXPORT_FORMATS.CSV
        ? asCsvText({value: timestamp})
        : timestamp,
      log.actor.name,
      log.actor.role,
      getAuditLogActionLabel({action: log.action, t}),
      log.resourceLabel,
      log.description,
      log.origin.ipAddress ?? '',
      log.origin.device ?? '',
    ];
  }),
});

// Fetches every activity log in the given date range and downloads it as the
// chosen format. Returns the exported row count so the caller can surface an
// empty-range message instead of downloading a file with no rows.
export const exportActivityLogs = async ({
  fromDate,
  toDate,
  format,
  t,
}: {
  fromDate: string;
  toDate: string;
  format: DashboardExportFormat;
  t: (key: string) => string;
}): Promise<{count: number}> => {
  const logs = await fetchAllAuditLogsInRange({fromDate, toDate});

  if (!logs.length) return {count: 0};

  await exportDashboardData({
    format,
    title: t('activityLog.export.title'),
    fileName: ACTIVITY_LOG_EXPORT.fileName,
    tables: [buildAuditLogExportTable({logs, format, t})],
  });

  return {count: logs.length};
};
