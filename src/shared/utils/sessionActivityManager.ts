import appConfig from '@/configs/appConfig';
import {
  SESSION_CHANNEL_MESSAGES,
  SESSION_TIMEOUT_REASONS,
} from '@/shared/constants/session';
import {
  BroadcastParams,
  LastActivityParams,
  MarkActivityOptions,
  SessionActivityManager,
  SessionChannelMessage,
  SessionState,
  SessionStateListener,
  TimeoutStateParams,
} from '@/shared/types/sessionActivity';

const state: SessionState = {
  isTimedOut: false,
  lastActivityAt: Date.now(),
  timeoutReason: null,
};

const listeners = new Set<SessionStateListener>();

let watchdogInterval: ReturnType<typeof setInterval> | null = null;
let broadcastChannel: BroadcastChannel | null = null;
let lastBroadcastAt = 0;
let globalListenersAttached = false;

const isBrowser = () => typeof window !== 'undefined';

const emit = () => {
  const snapshot = {...state};
  listeners.forEach((listener) => listener(snapshot));
};

const setTimeoutState = (params: TimeoutStateParams) => {
  const reason = params.isTimedOut ? params.reason : null;

  if (state.isTimedOut === params.isTimedOut && state.timeoutReason === reason)
    return;

  state.isTimedOut = params.isTimedOut;
  state.timeoutReason = reason;
  emit();
};

const updateLastActivity = ({at, clearTimeout = false}: LastActivityParams) => {
  if (at <= state.lastActivityAt) return;
  state.lastActivityAt = at;

  if (clearTimeout && (state.isTimedOut || state.timeoutReason)) {
    state.isTimedOut = false;
    state.timeoutReason = null;
  }

  emit();
};

const checkIdleTimeout = () => {
  if (!isBrowser() || state.isTimedOut) return;

  const isIdleExpired =
    Date.now() - state.lastActivityAt >= appConfig.sessionIdleTimeoutMs;

  if (isIdleExpired) {
    setTimeoutState({
      isTimedOut: true,
      reason: SESSION_TIMEOUT_REASONS.idle.value,
    });
  }
};

const ensureBroadcastChannel = () => {
  if (!isBrowser() || broadcastChannel || !('BroadcastChannel' in window))
    return;

  broadcastChannel = new BroadcastChannel(appConfig.sessionChannelName);

  broadcastChannel.onmessage = (event: MessageEvent<SessionChannelMessage>) => {
    const data = event.data;

    if (!data?.type) return;

    if (data.type === SESSION_CHANNEL_MESSAGES.activity.value) {
      updateLastActivity({at: data.at});
    } else if (data.type === SESSION_CHANNEL_MESSAGES.serverTimeout.value) {
      setTimeoutState({
        isTimedOut: true,
        reason: SESSION_TIMEOUT_REASONS.server.value,
      });
    } else if (data.type === SESSION_CHANNEL_MESSAGES.logout.value) {
      setTimeoutState({
        isTimedOut: true,
        reason: SESSION_TIMEOUT_REASONS.logout.value,
      });
    } else if (data.type === SESSION_CHANNEL_MESSAGES.login.value) {
      window.location.reload();
    }
  };
};

const broadcast = ({message}: BroadcastParams) => {
  ensureBroadcastChannel();
  broadcastChannel?.postMessage(message);
};

const onVisibilityOrFocusChange = () => {
  if (!isBrowser()) return;
  if (document.visibilityState === 'hidden') return;
  checkIdleTimeout();
};

const attachGlobalListeners = () => {
  if (!isBrowser() || globalListenersAttached) return;

  window.addEventListener('focus', onVisibilityOrFocusChange);
  document.addEventListener('visibilitychange', onVisibilityOrFocusChange);
  globalListenersAttached = true;
};

const detachGlobalListeners = () => {
  if (!isBrowser() || !globalListenersAttached) return;

  window.removeEventListener('focus', onVisibilityOrFocusChange);
  document.removeEventListener('visibilitychange', onVisibilityOrFocusChange);
  globalListenersAttached = false;
};

export const sessionActivityManager: SessionActivityManager = {
  startWatchdog() {
    if (!isBrowser() || watchdogInterval) return;

    ensureBroadcastChannel();
    attachGlobalListeners();

    watchdogInterval = setInterval(() => {
      checkIdleTimeout();
    }, appConfig.sessionWatchdogIntervalMs);
  },

  stopWatchdog() {
    if (watchdogInterval) {
      clearInterval(watchdogInterval);
      watchdogInterval = null;
    }

    detachGlobalListeners();
  },

  markActivity({
    broadcastToTabs = true,
    clearTimeout = false,
  }: MarkActivityOptions = {}) {
    const now = Date.now();
    updateLastActivity({at: now, clearTimeout});

    if (!broadcastToTabs || !isBrowser()) return;

    const canBroadcast =
      now - lastBroadcastAt >= appConfig.sessionActivityBroadcastThrottleMs;
    if (!canBroadcast) return;

    lastBroadcastAt = now;
    broadcast({
      message: {type: SESSION_CHANNEL_MESSAGES.activity.value, at: now},
    });
  },

  markExpiredByServer() {
    setTimeoutState({
      isTimedOut: true,
      reason: SESSION_TIMEOUT_REASONS.server.value,
    });
    broadcast({
      message: {type: SESSION_CHANNEL_MESSAGES.serverTimeout.value},
    });
  },

  markLogout() {
    setTimeoutState({
      isTimedOut: true,
      reason: SESSION_TIMEOUT_REASONS.logout.value,
    });
    broadcast({
      message: {type: SESSION_CHANNEL_MESSAGES.logout.value},
    });
  },

  markLogin() {
    broadcast({message: {type: SESSION_CHANNEL_MESSAGES.login.value}});
  },

  reset() {
    state.isTimedOut = false;
    state.lastActivityAt = Date.now();
    state.timeoutReason = null;
    emit();
  },

  getState() {
    return {...state};
  },

  subscribe(listener: SessionStateListener) {
    ensureBroadcastChannel();
    listeners.add(listener);
    listener({...state});

    return () => {
      listeners.delete(listener);
    };
  },
};
