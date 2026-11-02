'use client';

import AlertReasonStrip from '@/shared/components/common/alertReview/AlertReasonStrip';
import AlertReviewCard from '@/shared/components/common/alertReview/AlertReviewCard';
import EvidenceComment from '@/shared/components/common/alertReview/EvidenceComment';
import useTranslation from '@/shared/hooks/useTranslation';
import {AlertEvidenceCardProps} from '@/shared/interfaces/alertReview';

const AlertEvidenceCard = ({
  tone,
  reason,
  reasonLabel,
  meta,
  reasonNote,
  children,
  comments = [],
}: AlertEvidenceCardProps) => {
  const {t} = useTranslation();

  return (
    <AlertReviewCard title={t('alertReview.evidence.title')} meta={meta}>
      {reason && (
        <AlertReasonStrip
          tone={tone}
          reason={reason}
          label={reasonLabel}
          note={reasonNote}
        />
      )}
      {children}
      {comments.map((comment) => (
        <EvidenceComment key={comment.label} {...comment} />
      ))}
    </AlertReviewCard>
  );
};

export default AlertEvidenceCard;
