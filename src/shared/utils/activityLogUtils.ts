import {
  AUDIT_LOG_ACTION_COLORS,
  AUDIT_LOG_DEFAULT_ACTION_COLOR,
} from '@/shared/constants/activityLog';
import {RECENT_ACTIVITY} from '@/shared/constants/dashboard';
import {AuditLogDayGroup, AuditLogEntry} from '@/shared/interfaces/activityLog';
import {formatDate, groupByDay} from '@/shared/utils/dateUtils';

// "RED_FLAG_RAISED" -> "Red flag raised"
const humanizeAuditLogAction = ({action}: {action: string}): string => {
  const words = action.toLowerCase().split('_');

  return words
    .map((word, index) =>
      index === 0 ? `${word[0]?.toUpperCase()}${word.slice(1)}` : word
    )
    .join(' ');
};

// Translated when the action is a known common verb (activityLog.actions.*),
// otherwise humanized from the raw backend string -- the audit log's action
// vocabulary isn't a closed enum the frontend can fully pre-translate.
export const getAuditLogActionLabel = ({
  action,
  t,
}: {
  action: string;
  t: (key: string) => string;
}): string => {
  const translationKey = `activityLog.actions.${action.toLowerCase()}`;
  const translated = t(translationKey);

  return translated === translationKey
    ? humanizeAuditLogAction({action})
    : translated;
};

export const getAuditLogActionColor = ({
  action,
}: {
  action: string;
}): {bg: string; fg: string} =>
  AUDIT_LOG_ACTION_COLORS[action.toLowerCase()] ||
  AUDIT_LOG_DEFAULT_ACTION_COLOR;

export const groupAuditLogsByDay = ({
  auditLogs,
}: {
  auditLogs: AuditLogEntry[];
}): AuditLogDayGroup[] =>
  groupByDay({
    items: auditLogs,
    getDate: ({item}) => item.timestamp,
    labelDay: ({date}) => formatDate({date, format: RECENT_ACTIVITY.dayFormat}),
  }).map(({label, items}) => ({day: label, items}));
