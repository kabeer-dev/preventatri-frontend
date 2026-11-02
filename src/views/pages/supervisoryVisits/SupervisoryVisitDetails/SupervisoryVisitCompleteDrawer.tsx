'use client';

import {useState} from 'react';

import CompletionDrawer from '@/shared/components/common/completion/CompletionDrawer';
import {
  SUPERVISORY_VISIT_COMPLETE_FORM_ID,
  SUPERVISORY_VISIT_EVIDENCE_ACCEPT,
  SUPERVISORY_VISIT_MAX_EVIDENCE_FILES,
  SUPERVISORY_VISIT_OUTCOME,
  SUPERVISORY_VISIT_OUTCOME_VALUES,
} from '@/shared/constants/supervisoryVisits';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {
  QueuedFollowUp,
  SupervisoryVisitCompleteDrawerProps,
} from '@/shared/interfaces/supervisoryVisit';
import {
  getFilingCopyKeys,
  getVisitLateMinutes,
} from '@/shared/utils/supervisoryVisitUtils';
import {
  formatDurationLabel,
  getAssigneeName,
} from '@/shared/utils/workItemUtils';

import QueuedFollowUpsSection from './QueuedFollowUpsSection';

// Filing a visit: outcome, findings, evidence and the follow-up tasks the
// nurse wants created with it. Filing late is allowed; the delay is shown. A
// visit sent back for correction starts from the outcome and findings it had.
const SupervisoryVisitCompleteDrawer = ({
  visit,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: SupervisoryVisitCompleteDrawerProps) => {
  const {t} = useTranslation();
  const {isAdmin} = useUserRole();
  const copy = getFilingCopyKeys({isAdmin});
  const lateMinutes = getVisitLateMinutes({visit});

  // The parent remounts the drawer on open (key), so the queue starts empty.
  const [queued, setQueued] = useState<QueuedFollowUp[]>([]);

  return (
    <CompletionDrawer
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={({values, files}) =>
        onSubmit({values, files, queuedFollowUps: queued})
      }
      isLoading={isLoading}
      formId={SUPERVISORY_VISIT_COMPLETE_FORM_ID}
      labels={{
        title: t(copy.title),
        subtitle: t(copy.subtitle, {
          assignee: getAssigneeName({assignee: visit.assignee}),
        }),
        outcome: t('supervisoryVisits.complete.outcome'),
        notes: t('supervisoryVisits.complete.notes'),
        notesHint: t('supervisoryVisits.complete.notesHint'),
        notesPlaceholder: t('supervisoryVisits.complete.notesPlaceholder'),
        evidence: t('supervisoryVisits.complete.evidence'),
        evidenceOptional: t('supervisoryVisits.complete.evidenceOptional'),
        permanent: t(copy.permanent),
        confirm: t(copy.confirm),
      }}
      outcomeOptions={Object.values(SUPERVISORY_VISIT_OUTCOME).map(
        ({value, labelKey}) => ({value, label: t(labelKey)})
      )}
      outcomeValues={SUPERVISORY_VISIT_OUTCOME_VALUES}
      defaultOutcome={
        visit.completionOutcome ?? SUPERVISORY_VISIT_OUTCOME.NO_CONCERNS.value
      }
      defaultNotes={visit.completionNotes}
      notesFieldName='Findings'
      warning={
        lateMinutes > 0
          ? t('supervisoryVisits.complete.overdueWarning', {
              duration: formatDurationLabel({minutes: lateMinutes, t}),
            })
          : null
      }
      accept={SUPERVISORY_VISIT_EVIDENCE_ACCEPT}
      maxFiles={SUPERVISORY_VISIT_MAX_EVIDENCE_FILES}
    >
      <QueuedFollowUpsSection
        visit={visit}
        queued={queued}
        onChange={({queued: next}) => setQueued(next)}
        disabled={isLoading}
      />
    </CompletionDrawer>
  );
};

export default SupervisoryVisitCompleteDrawer;
