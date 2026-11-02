'use client';

import AlertEvidenceCard from '@/shared/components/common/alertReview/AlertEvidenceCard';
import ChecklistEvidence from '@/shared/components/common/alertReview/ChecklistEvidence';
import EvidenceMedia from '@/shared/components/common/alertReview/EvidenceMedia';
import {DETAIL_IDENTITY_SEPARATOR} from '@/shared/constants/common';
import {FLAG_DETAIL_TYPES, TIMELINE_TIME_FORMAT} from '@/shared/constants/flag';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  CaseEvidenceCardProps,
  EvidenceCommentProps,
} from '@/shared/interfaces/alertReview';
import {getChecklistFlagSummary} from '@/shared/utils/alertReview';
import {formatDate} from '@/shared/utils/dateUtils';

const CaseEvidenceCard = ({
  caseDetails,
  tone,
  caregiverName,
}: CaseEvidenceCardProps) => {
  const {t} = useTranslation();

  const {reason, description, createdAt} = caseDetails;

  if (caseDetails.type === FLAG_DETAIL_TYPES.MANUAL) {
    const comments: EvidenceCommentProps[] = description
      ? [
          {
            label: t('alertReview.evidence.caregiverComment'),
            author: caregiverName,
            at: createdAt,
            text: description,
          },
        ]
      : [];

    return (
      <AlertEvidenceCard
        tone={tone}
        reason={reason}
        meta={t('alertReview.evidence.reportedManually')}
        comments={comments}
      >
        <EvidenceMedia
          images={caseDetails.images}
          audioUrl={caseDetails.audioNote?.url ?? null}
        />
      </AlertEvidenceCard>
    );
  }

  const {sections, template, submittedAt, visitNotes} = caseDetails.submission;
  const {flagged, total} = getChecklistFlagSummary({sections});

  const meta = [
    template?.title,
    submittedAt
      ? t('alertReview.evidence.submittedAt', {
          time: formatDate({date: submittedAt, format: TIMELINE_TIME_FORMAT}),
        })
      : '',
  ]
    .filter(Boolean)
    .join(DETAIL_IDENTITY_SEPARATOR);

  const candidateComments: (EvidenceCommentProps | null)[] = [
    visitNotes
      ? {
          label: t('alertReview.evidence.visitNotes'),
          author: caregiverName,
          at: submittedAt,
          text: visitNotes,
        }
      : null,
    description
      ? {label: t('alertReview.evidence.description'), text: description}
      : null,
  ];

  const comments = candidateComments.filter(
    (comment): comment is EvidenceCommentProps => comment !== null
  );

  return (
    <AlertEvidenceCard
      tone={tone}
      reason={reason}
      meta={meta}
      reasonNote={
        total > 0
          ? t('alertReview.evidence.flaggedCount', {flagged, total})
          : undefined
      }
      comments={comments}
    >
      <ChecklistEvidence sections={sections} />
    </AlertEvidenceCard>
  );
};

export default CaseEvidenceCard;
