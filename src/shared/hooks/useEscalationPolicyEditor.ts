import {useMemo, useState} from 'react';

import {
  ESCALATION_FLAG_OPTIONS,
  ESCALATION_NEW_STEP_MINUTES,
  ESCALATION_STEP_OPTIONS,
} from '@/shared/constants/settings';
import {organizationMutations, organizationQueries} from '@/shared/reactQuery';
import {
  EscalationChannel,
  EscalationDraftStep,
  EscalationFlag,
  EscalationPolicy,
  EscalationPolicyDraft,
  EscalationStepType,
  EscalationTtlUnit,
} from '@/shared/types/settings';
import {
  createDraftStepId,
  getDraftTotalMinutes,
  isAdminStep,
  isSameDraftSteps,
  isValidDraftSteps,
  sortChannels,
  toPolicyDraft,
  toPolicySteps,
} from '@/shared/utils/escalationPolicyUtils';
import {hasQuerySettledSince} from '@/shared/utils/reactQuery';

type DraftsByFlag = Partial<Record<EscalationFlag, EscalationPolicyDraft>>;

// Owns the escalation settings' edit state. Each flag colour keeps its own
// draft, so switching between the red and yellow tabs never loses unsaved
// edits; saving sends only the selected colour, since the API saves one policy
// at a time.
export const useEscalationPolicyEditor = () => {
  const {useFetchEscalationPolicies} = organizationQueries();
  const {useUpdateEscalationPolicyMutation} = organizationMutations();

  const {data, isLoading, dataUpdatedAt, errorUpdatedAt} =
    useFetchEscalationPolicies();
  const {mutate: updatePolicy, isPending} = useUpdateEscalationPolicyMutation();

  const [flag, setFlag] = useState<EscalationFlag>(
    ESCALATION_FLAG_OPTIONS[0].value
  );
  const [drafts, setDrafts] = useState<DraftsByFlag>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // The saved policies as drafts, rebuilt only when the server data changes
  // so row ids stay stable between renders.
  const savedDrafts = useMemo(() => {
    const policies: EscalationPolicy[] = data?.escalationPolicies ?? [];

    return policies.reduce<DraftsByFlag>(
      (acc, policy) => ({...acc, [policy.flag]: toPolicyDraft({policy})}),
      {}
    );
  }, [data]);

  // A saved draft is dropped once the policies query settles after the save,
  // so the view switches straight from the draft to the refetched policy.
  const toActiveDraft = (draft?: EscalationPolicyDraft) => {
    if (!draft?.savedAt) return draft;

    const hasSettled = hasQuerySettledSince({
      since: draft.savedAt,
      dataUpdatedAt,
      errorUpdatedAt,
    });

    return hasSettled ? undefined : draft;
  };

  const getDraft = ({flag: target}: {flag: EscalationFlag}) =>
    toActiveDraft(drafts[target]);

  const getSteps = ({flag: target}: {flag: EscalationFlag}) =>
    getDraft({flag: target})?.steps ?? savedDrafts[target]?.steps ?? [];

  const steps = getSteps({flag});
  const savedSteps = savedDrafts[flag]?.steps ?? [];
  const isSyncing = Boolean(getDraft({flag})?.savedAt);

  const isDirty =
    Boolean(getDraft({flag})) && !isSameDraftSteps({a: steps, b: savedSteps});
  const isValid = isValidDraftSteps({steps});

  const usedTypes = steps.map(({type}) => type);

  const unusedTypes = ESCALATION_STEP_OPTIONS.filter(
    ({value}) => !usedTypes.includes(value)
  ).map(({value}) => value);

  const updateSteps = ({
    updater,
  }: {
    updater: (current: EscalationDraftStep[]) => EscalationDraftStep[];
  }) => {
    setDrafts((prev) => {
      const base = toActiveDraft(prev[flag]) ?? savedDrafts[flag];

      if (!base) return prev;

      // A fresh edit starts a new unsaved draft, so `savedAt` is not carried.
      return {
        ...prev,
        [flag]: {version: base.version, steps: updater(base.steps)},
      };
    });
  };

  const updateStep = ({
    id,
    changes,
  }: {
    id: string;
    changes: Partial<EscalationDraftStep>;
  }) => {
    updateSteps({
      updater: (current) =>
        current.map((step) => (step.id === id ? {...step, ...changes} : step)),
    });
  };

  const handleTypeChange = ({
    id,
    type,
  }: {
    id: string;
    type: EscalationStepType;
  }) => updateStep({id, changes: {type}});

  const handleChannelsChange = ({
    id,
    channels,
  }: {
    id: string;
    channels: EscalationChannel[];
  }) => updateStep({id, changes: {channels: sortChannels({channels})}});

  // Digits only, so the field can be empty mid-edit but never hold "1.5".
  const handleTtlValueChange = ({id, value}: {id: string; value: string}) => {
    if (!/^\d*$/.test(value)) return;

    updateStep({id, changes: {ttlValue: value}});
  };

  const handleTtlUnitChange = ({
    id,
    unit,
  }: {
    id: string;
    unit: EscalationTtlUnit;
  }) => updateStep({id, changes: {ttlUnit: unit}});

  const handleRemoveStep = ({id}: {id: string}) =>
    updateSteps({
      updater: (current) => current.filter((step) => step.id !== id),
    });

  // New steps go just above ADMIN, which must stay last.
  const handleAddStep = () => {
    const [type] = unusedTypes;

    if (!type) return;

    updateSteps({
      updater: (current) => {
        const newStep: EscalationDraftStep = {
          id: createDraftStepId(),
          type,
          ttlValue: String(ESCALATION_NEW_STEP_MINUTES),
          ttlUnit: 'MINUTES',
          channels: current[current.length - 1]?.channels ?? [],
        };
        const adminIndex = current.findIndex((step) => isAdminStep({step}));
        const insertAt = adminIndex < 0 ? current.length : adminIndex;

        return [
          ...current.slice(0, insertAt),
          newStep,
          ...current.slice(insertAt),
        ];
      },
    });
  };

  // Moves a step within the timed steps; ADMIN is pinned to the end and
  // nothing can be moved below it.
  const handleMoveStep = ({id, toIndex}: {id: string; toIndex: number}) => {
    updateSteps({
      updater: (current) => {
        const fromIndex = current.findIndex((step) => step.id === id);
        const adminIndex = current.findIndex((step) => isAdminStep({step}));
        const lastMovable = (adminIndex < 0 ? current.length : adminIndex) - 1;
        const target = Math.max(0, Math.min(toIndex, lastMovable));

        if (
          fromIndex < 0 ||
          fromIndex === target ||
          isAdminStep({step: current[fromIndex]})
        ) {
          return current;
        }

        const next = [...current];
        const [moved] = next.splice(fromIndex, 1);

        next.splice(target, 0, moved);

        return next;
      },
    });
  };

  const clearDraft = ({flag: target}: {flag: EscalationFlag}) =>
    setDrafts((prev) => {
      const {[target]: _removed, ...rest} = prev;

      return rest;
    });

  const handleDiscard = () => clearDraft({flag});

  // Keeps the saved draft on screen, marked as saved, instead of clearing it:
  // the policies refetch only starts after this callback, and clearing now
  // would briefly show the old policy until it lands.
  const markDraftSaved = ({flag: target}: {flag: EscalationFlag}) =>
    setDrafts((prev) => {
      const draft = prev[target];

      if (!draft) return prev;

      return {...prev, [target]: {...draft, savedAt: Date.now()}};
    });

  const handleSave = () => {
    const draft = getDraft({flag});

    if (!draft || !isDirty || !isValid || isSyncing) return;

    const savedFlag = flag;

    updatePolicy({
      params: {flag: savedFlag},
      payload: {version: draft.version, steps: toPolicySteps({steps})},
      callBackFuncs: {
        onSuccess: () => markDraftSaved({flag: savedFlag}),
      },
    });
  };

  const flagTabs = ESCALATION_FLAG_OPTIONS.map((option) => ({
    ...option,
    stepCount: getSteps({flag: option.value}).length,
    isDirty:
      Boolean(getDraft({flag: option.value})) &&
      !isSameDraftSteps({
        a: getSteps({flag: option.value}),
        b: savedDrafts[option.value]?.steps ?? [],
      }),
  }));

  return {
    isLoading,
    hasPolicy: Boolean(savedDrafts[flag]),
    flag,
    setFlag,
    flagTabs,
    steps,
    totalMinutes: getDraftTotalMinutes({steps}),
    unusedTypes,
    isDirty,
    isValid,
    isPending: isPending || isSyncing,
    draggingId,
    setDraggingId,
    handleTypeChange,
    handleChannelsChange,
    handleTtlValueChange,
    handleTtlUnitChange,
    handleRemoveStep,
    handleAddStep,
    handleMoveStep,
    handleDiscard,
    handleSave,
  };
};
