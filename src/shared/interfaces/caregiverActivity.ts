import {DayGroup} from '@/shared/interfaces/utils';
import {StatusColor} from '@/shared/types/common';

/** What kind of thing the caregiver sent. Tasks and visits are not hers yet. */
export type CaregiverActivityKind = 'checklists' | 'redFlags';

/** One row in the Activity feed, whatever list it came from. */
export interface CaregiverActivityItem {
  id: string;
  kind: CaregiverActivityKind;

  /** The patient this row is about. What the patient filter matches on. */
  patientId: string;

  /** "Last, First", the way every caregiver list names a patient. */
  patientName: string;

  /** When it was sent. Sorting and day grouping both read this. */
  timestamp: string;
  timeLabel: string;
  title: string;
  detail: string;
  statusLabel: string;

  /** The colour the record's own status map gives it. */
  statusColor: StatusColor;

  /** The existing record details page. */
  href: string;
}

/** One day's worth of rows, under "Today", "Yesterday" or "Mon 18 Aug". */
export type CaregiverActivityDay = DayGroup<CaregiverActivityItem>;

/** What the two Activity shells filter by. */
export interface CaregiverActivityFilters {
  kind: string;
  patient: string;
  range: number;
}
