'use client';

import AlertAgeClock from '@/shared/components/common/alertReview/AlertAgeClock';
import AlertEvidenceCard from '@/shared/components/common/alertReview/AlertEvidenceCard';
import AlertPeopleRail from '@/shared/components/common/alertReview/AlertPeopleRail';
import ChecklistEvidence from '@/shared/components/common/alertReview/ChecklistEvidence';
import EvidenceMedia from '@/shared/components/common/alertReview/EvidenceMedia';
import ReviewDetailLayout from '@/shared/components/common/alertReview/ReviewDetailLayout';
import FlagCaseDetailsModal from '@/shared/components/common/modals/FlagCaseDetailsModal';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import SLABreachCard from '@/shared/components/pages/dashboard/patientDetails/SLABreachCard';
import {RED_FLAG_STATUSES} from '@/shared/constants/flag';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {useModal} from '@/shared/hooks/modals/useModal';
import useAlertPeople from '@/shared/hooks/useAlertPeople';
import useAlertSeverityTone from '@/shared/hooks/useAlertSeverityTone';
import useTranslation from '@/shared/hooks/useTranslation';
import {EvidenceCommentProps} from '@/shared/interfaces/alertReview';
import {EmergencyFlagDetailsUIProps} from '@/shared/interfaces/flag';
import {
  buildDispatchFlagCase,
  getChecklistFlagSummary,
  getFlagStatusPresentation,
  isFlagAwaitingResolution,
} from '@/shared/utils/alertReview';
import {secondsUntilIso} from '@/shared/utils/dateUtils';
import {getReasonLabel} from '@/shared/utils/redFlagUtils';

import FlagResolution from './FlagResolution';
import FlagTimeline from './FlagTimeline';

const EmergencyFlagDetailsUI = ({
  emergencyFlag,
  onDispatchResolved,
}: EmergencyFlagDetailsUIProps) => {
  const {t} = useTranslation();
  const {isModalOpen, openModal, closeModal} = useModal();

  const {
    flag,
    createdAt,
    description,
    images,
    audioNote,
    patientId,
    voidedAt,
    voidReason,
    response,
    submission,
  } = emergencyFlag;

  const timeline = emergencyFlag.timeline || [];

  const checklistSections = submission?.sections?.length
    ? submission.sections
    : null;

  const {flagged, total} = getChecklistFlagSummary({
    sections: checklistSections ?? [],
  });

  const people = useAlertPeople({
    patient: emergencyFlag.patient,
    submitter: emergencyFlag.submitter,
    reportedAt: createdAt,
    showPatientRecord: true,
  });

  const tone = useAlertSeverityTone({flag});

  const status = emergencyFlag.status || RED_FLAG_STATUSES.ACTIVE;
  const presentation = getFlagStatusPresentation({flag, status});

  const reasonLabel = getReasonLabel({reason: emergencyFlag.reason});

  const isVoided = Boolean(voidedAt || voidReason);

  const isAwaitingResolution = isFlagAwaitingResolution({
    status,
    hasResponse: Boolean(response),
    isVoided,
  });

  const dispatchFlag = buildDispatchFlagCase({
    emergencyFlag,
    isAwaitingResolution,
    reason: reasonLabel,
    patientName: people.patientName,
    caregiverName: people.caregiverName,
  });

  const handleDispatchResolved = () => {
    closeModal();
    onDispatchResolved?.();
  };

  const comments: EvidenceCommentProps[] = description
    ? [
        {
          label: t('alertReview.evidence.caregiverComment'),
          author: people.caregiverName,
          at: createdAt,
          text: description,
        },
      ]
    : [];

  const hasResolution = Boolean(response) || isVoided || isAwaitingResolution;

  return (
    <>
      {(isAwaitingResolution || response) && (
        <TopBarSlot side='right'>
          <AlertAgeClock
            since={createdAt}
            resolvedAt={response?.createdAt}
            acceptedAt={emergencyFlag.acceptedAt}
            color={tone.ink}
          />
        </TopBarSlot>
      )}
      <ReviewDetailLayout
        backLabel={t('emergencyFlags.detail.backToList')}
        backHref={DASHBOARD_ROUTES.emergencyFlags.all()}
        name={people.patientName}
        avatarColor={presentation.color}
        banner={
          dispatchFlag && (
            <SLABreachCard
              flagType={dispatchFlag.flagType}
              symptom={dispatchFlag.reason}
              secondsRemaining={
                dispatchFlag.expiresAt
                  ? secondsUntilIso({iso: dispatchFlag.expiresAt})
                  : null
              }
              onDispatch={openModal}
              isAccepted={Boolean(emergencyFlag.acceptedAt)}
            />
          )
        }
        people={<AlertPeopleRail people={people} patientId={patientId} />}
        history={<FlagTimeline timeline={timeline} />}
        evidence={
          <AlertEvidenceCard
            tone={tone}
            reason={reasonLabel}
            reasonNote={
              total > 0
                ? t('alertReview.evidence.flaggedCount', {flagged, total})
                : undefined
            }
            comments={comments}
          >
            {checklistSections ? (
              <ChecklistEvidence sections={checklistSections} />
            ) : (
              <EvidenceMedia
                images={images || []}
                audioUrl={audioNote?.url || null}
              />
            )}
          </AlertEvidenceCard>
        }
        resolution={
          hasResolution && (
            <FlagResolution
              emergencyFlag={emergencyFlag}
              isVoided={isVoided}
              isAwaitingResolution={isAwaitingResolution}
              onAccepted={onDispatchResolved}
            />
          )
        }
      />
      {dispatchFlag && (
        <FlagCaseDetailsModal
          flag={dispatchFlag}
          isOpen={isModalOpen}
          onClose={closeModal}
          onResolve={handleDispatchResolved}
        />
      )}
    </>
  );
};

export default EmergencyFlagDetailsUI;
