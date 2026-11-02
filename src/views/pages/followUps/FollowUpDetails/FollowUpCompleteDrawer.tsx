'use client';

import CompletionDrawer from '@/shared/components/common/completion/CompletionDrawer';
import {
  FOLLOW_UP_COMPLETE_FORM_ID,
  FOLLOW_UP_EVIDENCE_ACCEPT,
  FOLLOW_UP_MAX_EVIDENCE_FILES,
  FOLLOW_UP_TASK_OUTCOME,
  FOLLOW_UP_TASK_OUTCOME_VALUES,
} from '@/shared/constants/followUps';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpCompleteDrawerProps} from '@/shared/interfaces/followUp';
import {
  formatDurationLabel,
  getAssigneeName,
  getLateMinutes,
} from '@/shared/utils/followUpUtils';

// Completing an overdue task is allowed; the delay is shown and recorded.
const FollowUpCompleteDrawer = ({
  task,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: FollowUpCompleteDrawerProps) => {
  const {t} = useTranslation();
  const lateMinutes = getLateMinutes({task});

  return (
    <CompletionDrawer
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoading}
      formId={FOLLOW_UP_COMPLETE_FORM_ID}
      labels={{
        title: t('followUps.complete.title'),
        subtitle: t('followUps.complete.subtitle', {
          title: task.title,
          assignee: getAssigneeName({assignee: task.assignee}),
        }),
        outcome: t('followUps.complete.outcome'),
        notes: t('followUps.complete.notes'),
        notesHint: t('followUps.complete.notesHint'),
        notesPlaceholder: t('followUps.complete.notesPlaceholder'),
        evidence: t('followUps.complete.evidence'),
        evidenceOptional: t('followUps.complete.evidenceOptional'),
        permanent: t('followUps.complete.permanent'),
        confirm: t('followUps.complete.confirm'),
      }}
      outcomeOptions={Object.values(FOLLOW_UP_TASK_OUTCOME).map(
        ({value, labelKey}) => ({value, label: t(labelKey)})
      )}
      outcomeValues={FOLLOW_UP_TASK_OUTCOME_VALUES}
      defaultOutcome={FOLLOW_UP_TASK_OUTCOME.DONE.value}
      notesFieldName='Completion notes'
      warning={
        lateMinutes > 0
          ? t('followUps.complete.overdueWarning', {
              duration: formatDurationLabel({minutes: lateMinutes, t}),
            })
          : null
      }
      accept={FOLLOW_UP_EVIDENCE_ACCEPT}
      maxFiles={FOLLOW_UP_MAX_EVIDENCE_FILES}
    />
  );
};

export default FollowUpCompleteDrawer;
