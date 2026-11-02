import {getProjectName} from '@/shared/utils/getAuthTokenKey';

const appConfig = {
  sessionIdleTimeoutMs: 10 * 60 * 1000,
  sessionWatchdogIntervalMs: 5000,
  sessionHeartbeatIntervalMs: 2 * 60 * 1000,
  sessionActivityBroadcastThrottleMs: 10000,
  sessionChannelName: `${getProjectName()}-session`,
};

export default appConfig;
