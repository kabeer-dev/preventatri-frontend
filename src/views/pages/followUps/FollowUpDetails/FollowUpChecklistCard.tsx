'use client';

import ChecklistSummaryCard from '@/shared/components/common/checklistRecordDetails/ChecklistSummaryCard';
import {FOLLOW_UP_TASK_OPEN_STATUSES} from '@/shared/constants/followUps';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpChecklistCardProps} from '@/shared/interfaces/followUp';
import {flattenSections} from '@/shared/utils/followUpUtils';

// Read-only question list for anyone but the assignee.
const FollowUpChecklistCard = ({task}: FollowUpChecklistCardProps) => {
  const {t} = useTranslation();

  return (
    <ChecklistSummaryCard
      title={task.checklistTemplate?.title || t('followUps.detail.checklist')}
      questions={
        task.checklistTemplate
          ? flattenSections({sections: task.checklistTemplate.sections})
          : []
      }
      hint={
        FOLLOW_UP_TASK_OPEN_STATUSES.includes(task.status)
          ? t('followUps.detail.answeredOnComplete')
          : undefined
      }
      emptyLabel={t('followUps.detail.noChecklist')}
    />
  );
};

export default FollowUpChecklistCard;
