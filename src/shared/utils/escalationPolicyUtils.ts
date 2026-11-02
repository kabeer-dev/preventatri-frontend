import {
  ESCALATION_CHANNELS,
  ESCALATION_STEP_TYPES,
  ESCALATION_TTL_UNITS,
} from '@/shared/constants/settings';
import {
  EscalationChannel,
  EscalationDraftStep,
  EscalationPolicy,
  EscalationPolicyDraft,
  EscalationPolicyStep,
} from '@/shared/types/settings';

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

let draftStepSeq = 0;

// Rows need a key that survives the admin changing a step's type or dragging
// it, so it can't be the type or the index.
export const createDraftStepId = () => {
  draftStepSeq += 1;

  return `escalation-step-${draftStepSeq}`;
};

export const toPolicyDraft = ({
  policy,
}: {
  policy: EscalationPolicy;
}): EscalationPolicyDraft => ({
  version: policy.version,
  steps: policy.steps.map(({type, ttlMinutes, ttlUnit, channels}) => {
    const unit = ttlUnit ?? 'MINUTES';

    return {
      id: createDraftStepId(),
      type,
      ttlValue:
        ttlMinutes === null
          ? ''
          : String(ttlMinutes / ESCALATION_TTL_UNITS[unit]),
      ttlUnit: unit,
      channels: sortChannels({channels}),
    };
  }),
});

export const sortChannels = ({channels}: {channels: EscalationChannel[]}) =>
  ESCALATION_CHANNELS.filter((channel) => channels.includes(channel));

export const isAdminStep = ({step}: {step: EscalationDraftStep}) =>
  step.type === ESCALATION_STEP_TYPES.admin;

// The step's deadline in minutes, or null while the field doesn't hold a
// positive whole number.
export const getDraftStepMinutes = ({step}: {step: EscalationDraftStep}) => {
  if (!/^\d+$/.test(step.ttlValue)) return null;

  const value = Number(step.ttlValue);

  return value >= 1 ? value * ESCALATION_TTL_UNITS[step.ttlUnit] : null;
};

export const isDraftStepDeadlineValid = ({step}: {step: EscalationDraftStep}) =>
  isAdminStep({step}) || getDraftStepMinutes({step}) !== null;

// Mirrors the backend's isValidPolicySteps, so Save is only offered for a
// policy the API will accept.
export const isValidDraftSteps = ({steps}: {steps: EscalationDraftStep[]}) => {
  const lastStep = steps[steps.length - 1];

  return (
    Boolean(lastStep) &&
    isAdminStep({step: lastStep}) &&
    new Set(steps.map(({type}) => type)).size === steps.length &&
    steps.every(
      (step) => step.channels.length > 0 && isDraftStepDeadlineValid({step})
    )
  );
};

export const toPolicySteps = ({
  steps,
}: {
  steps: EscalationDraftStep[];
}): EscalationPolicyStep[] =>
  steps.map((step) => {
    const isAdmin = isAdminStep({step});

    return {
      type: step.type,
      ttlMinutes: isAdmin ? null : getDraftStepMinutes({step}),
      ttlUnit: isAdmin ? null : step.ttlUnit,
      channels: sortChannels({channels: step.channels}),
    };
  });

// What the admin sees, without row ids. ADMIN's hidden deadline is dropped.
const serializeDraftSteps = ({steps}: {steps: EscalationDraftStep[]}) =>
  JSON.stringify(
    steps.map((step) => [
      step.type,
      isAdminStep({step}) ? '' : `${step.ttlValue}${step.ttlUnit}`,
      sortChannels({channels: step.channels}),
    ])
  );

// Compares what the admin sees, ignoring row ids.
export const isSameDraftSteps = ({
  a,
  b,
}: {
  a: EscalationDraftStep[];
  b: EscalationDraftStep[];
}) => {
  return serializeDraftSteps({steps: a}) === serializeDraftSteps({steps: b});
};

// Sum of every timed step's deadline: how long a flag can go unanswered
// before it reaches the final step.
export const getDraftTotalMinutes = ({steps}: {steps: EscalationDraftStep[]}) =>
  steps.reduce((total, step) => {
    if (isAdminStep({step})) return total;

    return total + (getDraftStepMinutes({step}) ?? 0);
  }, 0);

export const formatEscalationMinutes = ({
  minutes,
  t,
}: {
  minutes: number;
  t: TranslateFn;
}) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (!hours) return t('escalationSettings.duration.minutes', {count: rest});

  if (!rest) return t('escalationSettings.duration.hours', {count: hours});

  return t('escalationSettings.duration.hoursMinutes', {hours, minutes: rest});
};
