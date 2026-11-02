import {ThemeColor} from '@/@core/theme/types';

// The run is asynchronous: the request only queues it and the outcome arrives
// later over a socket. These shapes describe that handoff.

/** Payload keys that are HHAeXchange-managed only while `when` holds. */
export interface HhaManagedFieldGroup {
  fields: readonly string[];
  when: boolean;
}

/** Per-run counters, rolled up across every resource the run touched. */
export interface HhaSyncTotals {
  seen: number;
  created: number;
  updated: number;
  skipped: number;
}

/** Payload of the `hha-sync:completed` socket event. Counts and labels only. */
export interface HhaSyncCompletedSocketPayload {
  runId: string;
  success: boolean;
  totals: HhaSyncTotals;

  /** Human labels ("Patients", "Visits") of the resources that failed. */
  failedResources: string[];
}

/** Body of `GET /integration/sync/status`. */
export interface HhaSyncStatusResponse {
  isRunning: boolean;
  type: string;
}

/** Body of the 202 returned by `POST /integration/sync`. */
export interface HhaSyncQueuedResponse {
  runId: string;
  type: string;
}

/** Redux state for the Sync control. */
export interface HhaSyncState {
  isRunning: boolean;
  runId: string | null;
}

/** One bullet of the Sync confirmation copy: bold lead-in plus its detail. */
export interface HhaSyncConfirmItem {
  labelKey: string;
  textKey: string;
}

/** A grouped block of those bullets, with its own icon and palette colour. */
export interface HhaSyncConfirmSection {
  titleKey: string;
  icon: string;
  color: ThemeColor;
  items: HhaSyncConfirmItem[];
}

export interface HhaSyncConfirmSectionCardProps {
  section: HhaSyncConfirmSection;
}
