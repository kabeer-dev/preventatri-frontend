import {
  SESSION_CHANNEL_MESSAGES,
  SESSION_TIMEOUT_REASONS,
} from '@/shared/constants/session';

export type SessionTimeoutReason =
  (typeof SESSION_TIMEOUT_REASONS)[keyof typeof SESSION_TIMEOUT_REASONS]['value'];

export type SessionChannelMessage =
  | {type: typeof SESSION_CHANNEL_MESSAGES.activity.value; at: number}
  | {type: typeof SESSION_CHANNEL_MESSAGES.serverTimeout.value}
  | {type: typeof SESSION_CHANNEL_MESSAGES.logout.value}
  | {type: typeof SESSION_CHANNEL_MESSAGES.login.value};

export type SessionState = {
  isTimedOut: boolean;
  lastActivityAt: number;
  timeoutReason: SessionTimeoutReason | null;
};

export type SessionStateListener = (state: SessionState) => void;

export type TimeoutStateParams =
  | {isTimedOut: false}
  | {isTimedOut: true; reason: SessionTimeoutReason};

export type LastActivityParams = {at: number; clearTimeout?: boolean};

export type BroadcastParams = {message: SessionChannelMessage};

export type MarkActivityOptions = {
  broadcastToTabs?: boolean;
  clearTimeout?: boolean;
};

export interface SessionActivityManager {
  startWatchdog: () => void;
  stopWatchdog: () => void;
  markActivity: (options?: MarkActivityOptions) => void;
  markExpiredByServer: () => void;
  markLogout: () => void;
  markLogin: () => void;
  reset: () => void;
  getState: () => SessionState;
  subscribe: (listener: SessionStateListener) => () => void;
}
