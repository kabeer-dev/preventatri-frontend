// Socket event names. These MUST stay byte-identical to the backend
// SOCKET_EVENTS values (preventatri-backend/constants/socketsEventConstants.js)
// — the client subscribes by the exact string the server emits.
export const SOCKET_EVENTS = {
  ESCALATION_RED_FLAG: 'escalation:red-flag',
  ASSIGNED_RED_FLAG: 'assigned:red-flag',
  NOTIFICATION_NEW: 'notification:new',

  // A sync run finished; carries a `success` flag rather than being split into
  // two events, since the client does the same work either way.
  HHA_SYNC_COMPLETED: 'hha-sync:completed',
};
