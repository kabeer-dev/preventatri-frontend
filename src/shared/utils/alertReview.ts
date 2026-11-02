import {
  FLAGGED_RISK_RANK,
  HOURS_PER_DAY,
  MINUTES_PER_HOUR,
  RISK_FLAG_RANK,
  TRUTHY_ANSWER_VALUES,
} from '@/shared/constants/alertReview';
import {
  FLAG_DETAIL_TYPES,
  FLAG_TYPES,
  RED_FLAG_STATUSES,
  RED_FLAG_STATUS_PRESENTATION,
  YELLOW_FLAG_STATUS_PRESENTATION,
} from '@/shared/constants/flag';
import {
  BuildDispatchFlagCaseParams,
  ChecklistFlagSummary,
} from '@/shared/interfaces/alertReview';
import {
  CHECKLIST_FIELD_TYPES,
  ChecklistFieldType,
} from '@/shared/interfaces/assessmentChecklistDetails';
import {
  AutoFlagAnswerValue,
  AutoFlagSubmissionSection,
  FlagCaseDetails,
  FlagCaseSummary,
  ScoredOptionValue,
} from '@/shared/interfaces/flag';
import {SubmissionAnswer} from '@/shared/interfaces/submission';
import {AnswerDisplay} from '@/shared/types/alertReview';
import {getOptionLabel} from '@/shared/utils/assessmentChecklistUtils';

const getRank = ({flag}: {flag?: string | null}) =>
  RISK_FLAG_RANK[(flag ?? '').toLowerCase()] ?? 0;

export const getAnswerFlag = ({
  value,
}: {
  value: AutoFlagAnswerValue;
}): string | null => {
  const items = Array.isArray(value) ? value : [value];

  return items
    .filter(
      (item): item is ScoredOptionValue =>
        item !== null && typeof item === 'object' && 'flag' in item
    )
    .reduce<string | null>(
      (worst, item) =>
        getRank({flag: item.flag}) > getRank({flag: worst}) ? item.flag : worst,
      null
    );
};

export const isFlaggedAnswer = ({value}: {value: AutoFlagAnswerValue}) =>
  getRank({flag: getAnswerFlag({value})}) >= FLAGGED_RISK_RANK;

export const getChecklistFlagSummary = ({
  sections,
}: {
  sections: AutoFlagSubmissionSection[];
}): ChecklistFlagSummary => {
  const questions = sections.flatMap((section) => section.questions);

  return {
    total: questions.length,
    flagged: questions.filter((question) =>
      isFlaggedAnswer({value: question.answer?.value ?? null})
    ).length,
  };
};

export const getSubmissionSections = ({
  answers,
  fallbackTitle,
}: {
  answers: SubmissionAnswer[];
  fallbackTitle: string;
}): AutoFlagSubmissionSection[] =>
  answers.reduce<AutoFlagSubmissionSection[]>((sections, answer) => {
    const title = answer.question?.section?.title || fallbackTitle;

    let section = sections.find((existing) => existing.id === title);

    if (!section) {
      section = {id: title, title, sortOrder: sections.length, questions: []};
      sections.push(section);
    }

    section.questions.push({
      id: answer.id,
      title: answer.question?.title ?? '',
      type: answer.question?.type ?? CHECKLIST_FIELD_TYPES.TEXTAREA,
      required: answer.question?.required ?? false,
      sortOrder: section.questions.length,
      answer: {
        value: answer.value,
        comment: answer.comment,
        images: answer.images ?? [],
      },
    });

    return sections;
  }, []);

export const getAnswerDisplay = ({
  value,
  type,
}: {
  value: AutoFlagAnswerValue;
  type: ChecklistFieldType;
}): AnswerDisplay => {
  const isEmpty =
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty) return {kind: 'empty'};

  if (
    type === CHECKLIST_FIELD_TYPES.BOOLEAN ||
    type === CHECKLIST_FIELD_TYPES.CHECKBOX
  ) {
    return {kind: 'boolean', yes: TRUTHY_ANSWER_VALUES.includes(value)};
  }

  if (type === CHECKLIST_FIELD_TYPES.DATE && typeof value === 'string') {
    return {kind: 'date', iso: value};
  }

  const items = Array.isArray(value) ? value : [value];

  return {
    kind: 'text',
    text: items.map((item) => getOptionLabel({item})).join(', '),
  };
};

export const formatMinutes = ({
  totalMinutes,
}: {
  totalMinutes: number;
}): string => {
  const days = Math.floor(totalMinutes / MINUTES_PER_HOUR / HOURS_PER_DAY);
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR) % HOURS_PER_DAY;
  const minutes = totalMinutes % MINUTES_PER_HOUR;

  if (days > 0) return `${days}d ${hours}h`;

  if (hours > 0) return `${hours}h ${minutes}m`;

  return `${minutes}m`;
};

export const getFlagReportedAt = ({
  caseDetails,
}: {
  caseDetails?: FlagCaseDetails | null;
}): string | null => {
  if (!caseDetails) return null;

  if (caseDetails.type === FLAG_DETAIL_TYPES.AUTO)
    return caseDetails.submission?.submittedAt || caseDetails.createdAt;

  return caseDetails.createdAt;
};

export const buildDispatchFlagCase = ({
  emergencyFlag,
  isAwaitingResolution,
  reason,
  patientName,
  caregiverName,
}: BuildDispatchFlagCaseParams): FlagCaseSummary | null => {
  const {flag, escalationId, expiresAt, isAssignedToViewer} = emergencyFlag;

  const isYellow = (flag || '').toLowerCase() === FLAG_TYPES.YELLOW;

  // Yellow flags can always be resolved from here; a red one only once the
  // viewer accepted it (before that it is resolved from the alert popup).
  const isAccepted = Boolean(emergencyFlag.acceptedAt);

  if (!isAwaitingResolution || !isAssignedToViewer) return null;

  if (!isYellow && !isAccepted) return null;

  if (!escalationId) return null;

  return {
    id: escalationId,
    flagType: isYellow ? FLAG_TYPES.YELLOW : FLAG_TYPES.RED,
    reason,
    patientName,
    caregiverName,
    expiresAt: expiresAt ?? null,
  };
};

// The detail header's look for a flag's condition. The two status
// vocabularies in the codebase do not match (the list works in
// PENDING/RESOLVED/VOIDED), so an unmapped status degrades to the active
// presentation rather than throwing on `.color`.
export const getFlagStatusPresentation = ({
  flag,
  status,
}: {
  flag?: string | null;
  status: string;
}) => {
  const presentations =
    (flag || '').toLowerCase() === FLAG_TYPES.YELLOW
      ? YELLOW_FLAG_STATUS_PRESENTATION
      : RED_FLAG_STATUS_PRESENTATION;

  return (
    presentations[status as keyof typeof presentations] ??
    presentations[RED_FLAG_STATUSES.ACTIVE]
  );
};

// Still waiting on its assignee: open or accepted, with no response or void.
export const isFlagAwaitingResolution = ({
  status,
  hasResponse,
  isVoided,
}: {
  status: string;
  hasResponse: boolean;
  isVoided: boolean;
}) =>
  !hasResponse &&
  !isVoided &&
  (status === RED_FLAG_STATUSES.ACTIVE ||
    status === RED_FLAG_STATUSES.ACCEPTED);
