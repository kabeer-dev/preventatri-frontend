import {ReactNode} from 'react';

import {ThemeColor} from '@/@core/theme/types';
import {ChecklistFieldType} from '@/shared/interfaces/assessmentChecklistDetails';
import {
  AutoFlagAnswerValue,
  AutoFlagSubmissionQuestion,
  AutoFlagSubmissionSection,
  FlagCaseDetails,
  FlagCurrentAssignee,
  FlagEscalationResponse,
  FlagMediaFile,
  FlagPatientRef,
  FlagPersonRef,
  FlagTimelineEntry,
  RedFlagDetail,
} from '@/shared/interfaces/flag';
import {DetailFact} from '@/shared/interfaces/uiComponents';
import {SeverityLevel} from '@/shared/types/severity';

export interface BuildDispatchFlagCaseParams {
  emergencyFlag: RedFlagDetail;
  isAwaitingResolution: boolean;
  reason: string;
  patientName: string;
  caregiverName: string;
}

export interface AlertSeverityTone {
  level: SeverityLevel;
  glyph: string;
  labelKey: string;
  bar: string;
  tint: string;
  ink: string;
  onDark: string;
}

export interface UseAlertSeverityToneParams {
  flag?: string | null;
}

export interface AlertPeople {
  patientName: string;
  caregiverName: string;
  patientFacts: DetailFact[];
  reporterFacts: DetailFact[];

  // The patient card states the whole record, so the rail rules its rows.
  hasPatientRecord: boolean;
}

export interface UseAlertPeopleParams {
  patient?: FlagPatientRef | null;
  submitter?: FlagPersonRef | null;
  reportedAt?: string | null;

  // Set where the endpoint sends the patient's record facts and care team:
  // every row is then stated, an empty one as a dash, instead of dropped.
  showPatientRecord?: boolean;
}

export interface AlertReviewGridProps {
  people?: ReactNode;
  history?: ReactNode;
  evidence: ReactNode;
  resolution?: ReactNode;
}

export interface ReviewDetailLayoutProps extends AlertReviewGridProps {
  backLabel: string;
  backHref: string;
  name: string;
  avatarColor?: ThemeColor;
  banner?: ReactNode;
}

export interface AlertReviewCardProps {
  title: string;
  meta?: string;
  action?: ReactNode;
  children: ReactNode;
}

export interface AlertReasonStripProps {
  tone: AlertSeverityTone;
  reason: string;
  label?: string;
  note?: string;
}

export interface EvidenceCommentProps {
  label: string;
  author?: string;
  at?: string | null;
  text: string;
}

export interface AlertEvidenceCardProps {
  tone: AlertSeverityTone;
  reason?: string;
  reasonLabel?: string;
  meta?: string;
  reasonNote?: string;
  children?: ReactNode;
  comments?: EvidenceCommentProps[];
}

export interface EvidenceEmptyNoteProps {
  message: string;
}

export interface EvidenceMediaProps {
  images: FlagMediaFile[];
  audioUrl: string | null;
}

export interface ChecklistEvidenceProps {
  sections: AutoFlagSubmissionSection[];
}

export interface ChecklistAnswerRowProps {
  question: AutoFlagSubmissionQuestion;
}

export interface ChecklistAnswerValueProps {
  value: AutoFlagAnswerValue;
  type: ChecklistFieldType;
  color: string;
}

export interface ChecklistFlagSummary {
  flagged: number;
  total: number;
}

export interface AlertPeopleRailProps {
  people: AlertPeople;
  patientId?: string;
  hideReporter?: boolean;
}

export interface CaseEvidenceCardProps {
  caseDetails: FlagCaseDetails;
  tone: AlertSeverityTone;
  caregiverName: string;
}

export interface CaseReviewHeaderProps {
  tone: AlertSeverityTone;
  titleId: string;
  patientName: string;
  reason: string;
  identityParts: string[];
  expiresAt: string | null;
  openedAt?: string | null;
  onExit?: () => void;
}

export interface SlaClockProps {
  expiresAt: string;
  color: string;
}

export interface AlertAgeClockProps {
  since: string;
  resolvedAt?: string | null;
  acceptedAt?: string | null;
  color: string;
  labelColor?: string;
}

export interface ResolutionActionOptionProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export interface ResolutionScheduledItemProps {
  icon: string;
  title: string;
  facts: DetailFact[];
}

export interface ResolutionBlockProps {
  label: string;
  icon?: string;
  children: ReactNode;
}

export interface ResolutionSummaryCardProps {
  response: FlagEscalationResponse;
}

export interface ResolutionPendingCardProps {
  currentAssignee?: FlagCurrentAssignee | null;
  timeline: FlagTimelineEntry[];
  acceptedAt?: string | null;
  acceptedBy?: FlagPersonRef | null;

  // Shown only to the assignee while the flag can still be accepted.
  onAccept?: () => void;
  isAccepting?: boolean;
}

export interface FlagResolutionProps {
  emergencyFlag: RedFlagDetail;
  isVoided: boolean;
  isAwaitingResolution: boolean;
  onAccepted?: () => void;
}

export interface VoidSummaryCardProps {
  voidedAt?: string | null;
  voidedBy?: FlagPersonRef | null;
  voidReason?: string | null;
}
