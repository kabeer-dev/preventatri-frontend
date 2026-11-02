import {ReactNode} from 'react';

import {Control} from 'react-hook-form';

import {ThemeColor} from '@/@core/theme/types';
import {
  FLAG_DETAIL_TYPES,
  FLAG_TYPES,
  RED_FLAG_STATUSES,
} from '@/shared/constants/flag';
import {ChecklistFieldType} from '@/shared/interfaces/assessmentChecklistDetails';
import {PatientStaffRef} from '@/shared/interfaces/patient';
import {CustomColorToken} from '@/shared/types/common';
import {
  ActionTakenFormValues,
  ActiveFlagFieldVariant,
  TimerPillEmphasis,
} from '@/shared/types/flag';
import {SeverityLevel} from '@/shared/types/severity';

export type FlagType = (typeof FLAG_TYPES)[keyof typeof FLAG_TYPES];

export type RedFlagStatus =
  (typeof RED_FLAG_STATUSES)[keyof typeof RED_FLAG_STATUSES];

export interface FlagCaseDetailsEndpointParams {
  id: string;
}

export interface PatientActiveFlagEndpointParams {
  patientId: string;
  type?: string;
}

// The part of a flag the case review modal reads. `id` is the escalation id.
export interface FlagCaseSummary {
  id: string;
  flagType: FlagType;
  reason: string;
  patientName: string;
  caregiverName: string;
  expiresAt: string | null;
}

export interface ActiveFlagItem extends FlagCaseSummary {
  patientId?: string | null;
  description: string;
  remainingRedFlags: number;
  remainingYellowFlags: number;

  // Set once the caller accepted it: it no longer escalates.
  acceptedAt?: string | null;

  // The caller may accept it: still waiting on them, and below ADMIN.
  canAccept?: boolean;
}

export interface AcceptFlagParams {
  escalationId: string;
  onAccepted?: () => void;
}

export interface ActiveFlagsResponse {
  flag: ActiveFlagItem | null;
}

export interface ActiveFlagModalProps {
  flag: ActiveFlagItem;
  onOpenCaseDetails: () => void;

  // Fired when the flag's SLA window closes while the modal is open, so the
  // parent can refetch and surface the next assigned flag (if any).
  onExpire: () => void;
}

export interface ActiveFlagAccentConfig {
  edge: CustomColorToken;

  // An sx colour path (e.g. `common.white`), resolved against the theme.
  tileGlyphColor: string;
  glyphSize: number;
  isPulsing: boolean;
}

// Colours for one flag, resolved to real values so they can be fed to
// `alpha()` as well as used directly in sx.
export interface EmergencyFlagDetailsUIProps {
  emergencyFlag: RedFlagDetail;
  onDispatchResolved?: () => void;
}

export interface SLABreachCardProps {
  flagType: FlagType;
  symptom?: string;
  secondsRemaining: number | null;
  onDispatch?: () => void;

  /** Accepted by the viewer: no deadline left, only the resolve step. */
  isAccepted?: boolean;
}

export interface ActiveFlagAccent {
  severity: SeverityLevel;
  color: ThemeColor;
  glyph: string;
  glyphSize: number;
  tileGlyphColor: string;
  isPulsing: boolean;
  tint: string;
  ink: string;
  edge: string;
}

export interface UseActiveFlagAccentParams {
  flagType: FlagType;
}

export interface ActiveFlagHeaderProps {
  accent: ActiveFlagAccent;
  title: string;
  subtitle: string;
  titleId: string;
  subtitleId: string;
  expiresAt: string | null;
  openedAt?: string | null;

  // Once accepted, the clocks stop: a frozen "Accepted in" pill replaces the
  // live "Open for" pill and the countdown.
  acceptedAt?: string | null;
  onExpire: () => void;
  onClose?: () => void;
}

export interface SeverityIconTileProps {
  accent: ActiveFlagAccent;
}

export interface ActiveFlagFieldProps {
  label: string;
  children: ReactNode;
  variant?: ActiveFlagFieldVariant;
  accent?: ActiveFlagAccent;
  startAdornment?: ReactNode;
}

export interface ActiveFlagPersonFieldProps {
  label: string;
  name: string;
  color: ThemeColor;
}

export interface ActiveFlagFooterProps {
  accent: ActiveFlagAccent;
  remainingFlags: number;
  onOpenCaseDetails: () => void;
  onDismiss?: () => void;

  // Shown only while the caller may still accept the flag.
  onAccept?: () => void;
  isAccepting?: boolean;
}

export interface TimerPillProps {
  icon: string;
  label: string;
  value?: string;
  accentColor: ThemeColor;
  emphasis?: TimerPillEmphasis;
}

export interface OpenForPillProps {
  since: string;
  accentColor: ThemeColor;
}

export interface AcceptedPillProps {
  since?: string | null;
  acceptedAt: string;
  accentColor: ThemeColor;
}

export interface UseActiveFlagOpenedAtParams {
  id: string;
}

export interface ExpiryCountdownProps {
  expiresAt: string;
  accentColor: ThemeColor;
  onExpire?: () => void;
}

export interface RemainingFlagsBannerProps {
  count: number;
  accentColor: ThemeColor;
}

export interface FlagMediaFile {
  url: string;
  key: string;
}

export interface FlagPersonRef {
  firstName?: string;
  lastName?: string;
  phoneNo?: string;
  email?: string;
  address?: string;
  city?: string;
}

// The patient as the flag detail endpoint returns them: contact details plus
// the record facts and care team the review page states beside the alert.
// Every extra is optional, since the other flag reads send the contact only.
export interface FlagPatientRef extends FlagPersonRef {
  dateOfBirth?: string | null;
  medicaidId?: string | null;
  diagnoses?: string | null;
  emergencyContact?: string | null;
  primaryNurse?: PatientStaffRef | null;
  secondaryNurse?: PatientStaffRef | null;
  caseManager?: PatientStaffRef | null;
  assignedCaregivers?: PatientStaffRef[];
}

export interface FlagTimelineUser {
  firstName?: string | null;
  lastName?: string | null;
}

// A single event in a flag's activity timeline: what happened (STARTED,
// ASSIGNED, RESOLVED, ...), when, at which escalation level (null for events
// that have none), who it involved, and any note recorded with it.
export interface FlagTimelineEntry {
  type: string;
  at: string;
  level: string | null;
  user: FlagTimelineUser | null;
  notes: string | null;
}

export interface FlagCurrentAssignee extends FlagTimelineUser {
  level: string;
  assignedAt: string;
}

export interface FlagTimelineProps {
  timeline: FlagTimelineEntry[];
}

export interface FlagEscalationResponseSubmitter {
  firstName: string | null;
  lastName: string | null;
}

export interface FlagEscalationResponse {
  id: string;
  actions: number[];
  notes: string | null;
  hasFollowUp: boolean;
  followUpDate: string | null;
  followUpDescription: string | null;
  hasSupervisoryVisit: boolean;
  supervisoryVisitDate: string | null;
  supervisoryInstructions: string | null;
  attachments: FlagMediaFile[];
  submitter: FlagEscalationResponseSubmitter | null;
  createdAt: string;
}

export interface FlagResponseCardProps {
  response: FlagEscalationResponse;
}

// Red flag detail. reason is a number on the list/detail-page API and a
// pre-resolved string label on the modal case-details API; id and voidedAt
// are absent from the flat modal response, so both are optional here.
export interface RedFlagDetail {
  id?: string;
  status?: RedFlagStatus;

  // Flag colour (uppercase RED/YELLOW/GREEN) on the list/detail-page API;
  // absent from the flat modal case-details response, so optional.
  flag?: string;
  reason: number | string;
  description: string;
  images: FlagMediaFile[];
  audioNote: FlagMediaFile | null;
  patient: FlagPatientRef;
  submitter: FlagPersonRef;
  patientId?: string;
  voidedAt?: string | null;
  voidReason?: string | null;
  voidedBy?: FlagPersonRef | null;
  createdAt: string;
  timeline?: FlagTimelineEntry[];
  response?: FlagEscalationResponse | null;
  escalationId?: string | null;
  expiresAt?: string | null;
  isAssignedToViewer?: boolean;
  currentAssignee?: FlagCurrentAssignee | null;

  // Set once the escalation assignee accepted it.
  acceptedAt?: string | null;
  acceptedBy?: FlagPersonRef | null;

  // The viewer is the assignee and may still accept it (never at ADMIN).
  canAccept?: boolean;
  submission?: AutoFlagSubmission | null;
}

// Manual flag case-details. Manual flags are always red (raised directly by a
// caregiver) and carry supporting evidence (images + voice note) rather than a
// checklist submission. reason arrives as a pre-resolved string label.
export interface ManualFlagCaseDetails {
  patientId?: string;
  escalationId: string;
  type: typeof FLAG_DETAIL_TYPES.MANUAL;
  flagType: typeof FLAG_TYPES.RED;
  reason: string;
  description: string;
  patient: FlagPatientRef;
  submitter: FlagPersonRef;
  createdAt: string;
  images: FlagMediaFile[];
  audioNote: FlagMediaFile | null;
}

// A scored option as stored on an auto-submission answer. The risk `flag`
// and `points` are present in the payload but intentionally not surfaced in
// the case-details view.
export interface ScoredOptionValue {
  flag: string;
  title: string | number;
  points: number;
}

export type AutoFlagAnswerValue =
  ScoredOptionValue | ScoredOptionValue[] | string | number | null;

export interface AutoFlagSubmissionAnswer {
  value: AutoFlagAnswerValue;
  comment: string | null;
  images: FlagMediaFile[];
}

export interface AutoFlagSubmissionQuestion {
  id: string;
  title: string;
  type: ChecklistFieldType;
  required: boolean;
  sortOrder: number;
  answer: AutoFlagSubmissionAnswer | null;
}

export interface AutoFlagSubmissionSection {
  id: string;
  title: string;
  sortOrder: number;
  questions: AutoFlagSubmissionQuestion[];
}

export interface AutoFlagSubmission {
  id: string;
  submittedAt: string | null;
  visitNotes: string | null;
  template: {id: string; title: string; description: string} | null;
  sections: AutoFlagSubmissionSection[];
}

// Flag auto-generated from a checklist submission risk calculation. Carries
// the full scored submission grouped into sections; flagType may be red or
// yellow depending on the computed risk.
export interface AutoFlagCaseDetails {
  patientId?: string;
  escalationId: string;
  type: typeof FLAG_DETAIL_TYPES.AUTO;
  flagType: FlagType;
  reason: string;
  description: string;
  patient: FlagPatientRef;
  submitter: FlagPersonRef;
  createdAt: string;
  submission: AutoFlagSubmission;
}

export type FlagCaseDetails = AutoFlagCaseDetails | ManualFlagCaseDetails;

export interface FlagCaseDetailsResponse {
  flagDetails: FlagCaseDetails;
}

export interface FlagCaseDetailsModalProps {
  flag: FlagCaseSummary;
  isOpen: boolean;
  onClose: () => void;
  onResolve: () => void;
}

// Request body for POST /assessments/escalations/:id/resolve.
export interface ResolveEscalationPayload {
  actions: number[];
  notes: string;
  hasFollowUp: boolean;
  followUpDate: string | null;
  followUpTitle: string | null;
  followUpDescription: string | null;
  followUpAssigneeUserOrganizationId: string | null;
  followUpPriority: string | null;
  followUpChecklistTemplateId: string | null;
  hasSupervisoryVisit: boolean;
  supervisoryVisitStartAt: string | null;
  supervisoryVisitEndAt: string | null;
  supervisoryVisitAssigneeUserOrganizationId: string | null;
  supervisoryVisitChecklistTemplateId: string | null;
  supervisoryInstructions: string | null;
}

export interface ActionTakenFormProps {
  flagId: string;
  patientId?: string;
  onResolved: () => void;
}

export interface ResolutionActionsGroupProps {
  control: Control<ActionTakenFormValues>;
  disabled?: boolean;
  errorMessage?: string;
}

export interface AlsoCreateSectionProps {
  control: Control<ActionTakenFormValues>;
  patientId?: string;
  disabled?: boolean;
}

export interface FollowUpCreationFieldsProps {
  control: Control<ActionTakenFormValues>;
  patientId?: string;
  disabled?: boolean;
}
