import type {ThemeColor} from '@/@core/layouts/types';

// A label/value pair shown beneath an entry's users (e.g. "Assigned" → date).
export interface ActivityDetail {
  label: string;
  value: string;
}

export interface ActivityLogEntry {
  id: string;
  title: string;
  timestamp: string;
  users: {
    name: string;
    role?: string;
    avatar?: string;
    avatarColor?: ThemeColor;
  }[];
  details?: ActivityDetail[];
  dotColor: ThemeColor;
}

export interface ActivityTimelineProps {
  title: string;
  entries: ActivityLogEntry[];
  emptyMessage?: string;
}
