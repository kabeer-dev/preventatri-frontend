export const SESSION_TIMEOUT_REASONS = {
  idle: {value: 'idle'},
  server: {value: 'server'},
  logout: {value: 'logout'},
} as const;

export const SESSION_CHANNEL_MESSAGES = {
  activity: {value: 'activity'},
  serverTimeout: {value: 'serverTimeout'},
  logout: {value: 'logout'},
  login: {value: 'login'},
} as const;

export const RESTORED_RETURN_URL_KEY = 'restoredReturnUrlAt';

export const RESTORED_RETURN_URL_TTL_MS = 15000;
