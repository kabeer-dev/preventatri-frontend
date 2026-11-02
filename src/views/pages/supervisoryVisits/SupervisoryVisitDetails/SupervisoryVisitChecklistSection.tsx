'use client';

import ChecklistSummaryCard from '@/shared/components/common/checklistRecordDetails/ChecklistSummaryCard';
import {SUPERVISORY_VISIT_OPEN_STATUSES} from '@/shared/constants/supervisoryVisits';
import useTranslation from '@/shared/hooks/useTranslation';
import {SupervisoryVisitCardProps} from '@/shared/interfaces/supervisoryVisit';
import {flattenSections} from '@/shared/utils/workItemUtils';
import FollowUpAnswersCard from '@/views/pages/followUps/FollowUpDetails/FollowUpAnswersCard';

// Filed answers once the visit left the nurse's hands; otherwise the question
// list. The assignee answers them in the checklist run, not on this page.
const SupervisoryVisitChecklistSection = ({
  visit,
}: SupervisoryVisitCardProps) => {
  const {t} = useTranslation();
  const isOpen = SUPERVISORY_VISIT_OPEN_STATUSES.includes(visit.status);

  if (visit.answers?.length && (!isOpen || visit.completionOutcome))
    return <FollowUpAnswersCard answers={visit.answers} />;

  return (
    <ChecklistSummaryCard
      title={
        visit.checklistTemplate?.title ||
        t('supervisoryVisits.detail.checklist')
      }
      questions={
        visit.checklistTemplate
          ? flattenSections({sections: visit.checklistTemplate.sections})
          : []
      }
      hint={isOpen ? t('supervisoryVisits.detail.answeredOnFile') : undefined}
      emptyLabel={t('supervisoryVisits.detail.noChecklist')}
    />
  );
};

export default SupervisoryVisitChecklistSection;
