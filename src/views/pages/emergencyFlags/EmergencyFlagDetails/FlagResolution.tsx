'use client';

import FlagResponseCard from '@/shared/components/common/alertReview/FlagResponseCard';
import VoidSummaryCard from '@/shared/components/common/alertReview/VoidSummaryCard';
import useAcceptFlag from '@/shared/hooks/useAcceptFlag';
import {FlagResolutionProps} from '@/shared/interfaces/alertReview';

import ResolutionPendingCard from './ResolutionPendingCard';

// How the alert ended (response, void) or, while it waits, who holds it. The
// assignee can accept it from here, which stops its escalation.
const FlagResolution = ({
  emergencyFlag,
  isVoided,
  isAwaitingResolution,
  onAccepted,
}: FlagResolutionProps) => {
  const {acceptFlag, isAccepting} = useAcceptFlag();

  const {
    response,
    voidedAt,
    voidedBy,
    voidReason,
    escalationId,
    canAccept,
    acceptedAt,
    acceptedBy,
    currentAssignee,
  } = emergencyFlag;

  const handleAccept =
    canAccept && escalationId
      ? () => acceptFlag({escalationId, onAccepted})
      : undefined;

  return (
    <>
      {response && <FlagResponseCard response={response} />}
      {isVoided && (
        <VoidSummaryCard
          voidedAt={voidedAt}
          voidedBy={voidedBy}
          voidReason={voidReason}
        />
      )}
      {isAwaitingResolution && (
        <ResolutionPendingCard
          currentAssignee={currentAssignee}
          timeline={emergencyFlag.timeline || []}
          acceptedAt={acceptedAt}
          acceptedBy={acceptedBy}
          onAccept={handleAccept}
          isAccepting={isAccepting}
        />
      )}
    </>
  );
};

export default FlagResolution;
