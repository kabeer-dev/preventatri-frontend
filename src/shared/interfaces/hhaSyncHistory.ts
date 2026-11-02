import {ReactNode} from 'react';

import {ThemeColor} from '@/@core/theme/types';

// Shapes of the HHA Sync page: GET /integration/sync/{runs,changes,exceptions}.

export type HhaSyncTranslate = (
  key: string,
  options?: Record<string, string>
) => string;

export type HhaSyncFixIn = 'hha' | 'preventatri' | 'dev' | 'none';

/** Where "Fix here" points: the record the exception is about, or the other user. */
export type HhaSyncFixTarget = 'record' | 'relatedUser' | null;

export type HhaSyncRecordKind =
  'patient' | 'nurse' | 'caregiver' | 'caseManager' | 'visit' | 'user';

/** The PreventaTri record a history row's HHA id points at. */
export interface HhaSyncLinkedRecord {
  kind: HhaSyncRecordKind;
  id: string;
  name: string;
}

export interface HhaSyncRelatedUser {
  id: string;
  name: string;
  email: string;
  profile: {kind: HhaSyncRecordKind; id: string};
}

export interface HhaSyncRequester {
  id: string;
  name: string;
}

/** Counters of one resource within one run. */
export interface HhaSyncResourceSummary {
  resource: string;
  succeeded: boolean;
  startedAt: string | null;
  finishedAt: string | null;
  seen: number;
  created: number;
  updated: number;
  skipped: number;
  countiesResolved: number;
  primaryRegionsChanged: number;
  nurseLinksChanged: number;
  caseManagerLinksChanged: number;
  emailsChanged: number;
  exceptionCount: number;
  exceptionsByType?: Record<string, number>;

  // Absent on runs stored before blocking and warning exceptions were split.
  failed?: number;
  blockingCount?: number;
  warningCount?: number;
}

export interface HhaSyncResourceTimelineEntry {
  titleKey: string;
  dotColor: ThemeColor;
}

export interface HhaSyncRun {
  id: string;
  trigger: string;
  status: string;
  errorId: string | null;
  startedAt: string;
  finishedAt: string | null;
  summaries: Record<string, HhaSyncResourceSummary>;
  requestedBy: HhaSyncRequester | null;
  changeCount?: number;
}

export interface HhaSyncChangeEntry {
  field: string;
  from?: string | number | boolean | null;
  to?: string | number | boolean | null;
  redacted?: boolean;

  /** Names behind a link change's ids (county, nurse, case manager, region, user). */
  fromLabel?: string | null;
  toLabel?: string | null;
}

export interface HhaSyncChange {
  id: string;
  runId: string;
  resource: string;
  action: string;
  hhaRecordId: string;
  changes: HhaSyncChangeEntry[];
  record: HhaSyncLinkedRecord | null;
  createdAt: string;
}

export interface HhaSyncException {
  id: string;
  resource: string;
  type: string;
  hhaRecordId: string | null;
  detail: string | null;
  status: string;
  occurrences: number;
  firstSeenAt: string;
  lastSeenAt: string;
  resolvedAt: string | null;
  resolutionNote: string | null;
  record: HhaSyncLinkedRecord | null;
  relatedUser: HhaSyncRelatedUser | null;

  /** On a nurse conflict: the primary nurse PreventaTri has now. */
  preventatriNurse?: HhaSyncLinkedRecord | null;

  /** On a case manager conflict: the case manager PreventaTri has now. */
  preventatriCaseManager?: HhaSyncLinkedRecord | null;

  /** On a per-person row: how many patients wait for that person. */
  waitingPatientCount?: number;

  /** On a per-person row: where that person's invitation stands. */
  invitationStatus?: string | null;

  /** The admin who last resolved or dismissed it; kept after a reopen. */
  resolvedBy: HhaSyncRequester | null;

  /** Set on a reopen; reopenedBy is null when a repeat in a later sync reopened it. */
  reopenedAt: string | null;
  reopenedBy: HhaSyncRequester | null;
}

/** How one kind of link conflict is worded, and where its current holder sits. */
export interface HhaSyncLinkConflict {
  copyKey: string;
  holderField: 'preventatriNurse' | 'preventatriCaseManager';
}

/** One patient waiting for the person an exception names. */
export interface HhaWaitingPatient {
  patientId: string;
  hhaPatientId: string | null;
  name: string;

  /** Who holds the patient meanwhile, if anyone. */
  current: {id: string; name: string} | null;
}

export interface HhaSyncWaitingPatientsProps {
  exception: HhaSyncException;
}

export interface HhaSyncExceptionCounts {
  total: number;
  byType: Record<string, number>;
}

export interface HhaSyncChip {
  labelKey: string;
  color: ThemeColor;
}

export interface HhaSyncExceptionTypeMeta {
  fixIn: HhaSyncFixIn;
  fixTarget: HhaSyncFixTarget;
}

/** Query params of the three list endpoints. */
export interface HhaSyncListParams {
  page?: number;
  limit?: number;
  status?: string;
  trigger?: string;
  resource?: string;
  action?: string;
  type?: string;
  runId?: string;
  choice?: string;
}

export interface HhaSyncColumnsOptions {
  t: HhaSyncTranslate;
  zone: string | undefined;
}

export interface HhaSyncRunCell {
  row: HhaSyncRun;
}

export interface HhaSyncChangeCell {
  row: HhaSyncChange;
}

export interface HhaSyncExceptionCell {
  row: HhaSyncException;
}

export interface HhaSyncRecordLinkProps {
  record: HhaSyncLinkedRecord | null;
  fallback: string;
}

export interface HhaSyncChangeFieldsProps {
  entries: HhaSyncChangeEntry[];
  action: string;
}

export interface HhaSyncRunPageProps {
  params: Promise<{id: string}>;
}

export interface HhaSyncRunDetailsProps {
  runId: string;
}

export interface HhaSyncRunDetailsUIProps {
  run: HhaSyncRun;
}

/** Narrows a Changes or Exceptions table to one run. */
export interface HhaSyncRunScopedTableProps {
  runId?: string;
}

export interface HhaSyncResourceCardProps {
  summary: HhaSyncResourceSummary;
}

export interface HhaSyncExceptionDetailModalProps {
  exception: HhaSyncException | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface HhaSyncExceptionFixRowsProps {
  type: string;
}

export interface HhaSyncExceptionActionsProps {
  exception: HhaSyncException;

  /** Called once an action saved, so the dialog closes instead of showing stale status. */
  onDone: () => void;
}

export interface HhaSyncAddCountyForm {
  regionId: string;
}

export interface HhaSyncDetailRowProps {
  label: string;
  children: ReactNode;
}

export interface HhaSyncFormatChangeValueInput {
  value: HhaSyncChangeEntry['from'];
  label?: string | null;
  zone: string | undefined;
}

/** One person in a group sharing an HHAeXchange address. */
export interface HhaEmailConflictMember {
  userId: string | null;
  pendingId?: string;
  name: string;
  loginEmail: string | null;
  state: string;

  /** False for a user HHAeXchange did not give this address to, or once they accepted. */
  isEditable: boolean;

  /** Null while the person is not imported yet. */
  invitationStatus: string | null;
  profile: {kind: HhaSyncRecordKind; id: string | null};
}

export interface HhaEmailConflict {
  email: string;
  needsAttention: boolean;
  members: HhaEmailConflictMember[];
}

export interface HhaEmailConflictCell {
  row: HhaEmailConflict;
}

export interface HhaEmailChangeTarget {
  member: HhaEmailConflictMember;
  sharedEmail: string;
}

export interface HhaEmailConflictColumnsOptions {
  t: HhaSyncTranslate;
  onChangeEmail: (target: HhaEmailChangeTarget) => void;
}

export interface HhaEmailConflictMembersProps {
  conflict: HhaEmailConflict;
  onChangeEmail: (target: HhaEmailChangeTarget) => void;
}

export interface HhaEmailConflictMemberActionsProps {
  member: HhaEmailConflictMember;
  sharedEmail: string;
  onChangeEmail: (target: HhaEmailChangeTarget) => void;
}

export interface HhaSyncChangeEmailModalProps {
  target: HhaEmailChangeTarget | null;
  isOpen: boolean;
  onClose: () => void;
}

/** One coordinator HHAeXchange lists on a patient. */
export interface HhaPatientCoordinator {
  slot: number;
  name: string;

  /** Null while the name matches no case manager here. */
  caseManagerProfileId: string | null;
  isArchived: boolean;

  /** Only an active coordinator can be made the case manager. */
  isActive: boolean;
  isCaseManager: boolean;
}

export interface HhaCoordinatorPatient {
  patientId: string;
  hhaPatientId: string | null;
  name: string;
  isChosen: boolean;
  coordinators: HhaPatientCoordinator[];
}

export interface HhaCoordinatorPatientCell {
  row: HhaCoordinatorPatient;
}

/** What the picker needs to know about the patient it opens on. */
export interface HhaCoordinatorPickerTarget {
  patientId: string;
  name: string;
  coordinators: HhaPatientCoordinator[];
}

export interface HhaCoordinatorColumnsOptions {
  t: HhaSyncTranslate;
  onChoose: (target: HhaCoordinatorPickerTarget) => void;
}

export interface HhaCoordinatorListProps {
  coordinators: HhaPatientCoordinator[];
}

export interface HhaCoordinatorPickerModalProps {
  target: HhaCoordinatorPickerTarget | null;
  isOpen: boolean;
  onClose: () => void;
}
