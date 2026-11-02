'use client';

import {FOLLOW_UP_TASK_OPEN_STATUSES} from '@/shared/constants/followUps';
import {FollowUpChecklistSectionProps} from '@/shared/interfaces/followUp';

import FollowUpAnswersCard from './FollowUpAnswersCard';
import FollowUpChecklistCard from './FollowUpChecklistCard';

// Answers once the task is closed; otherwise the question list. The assignee
// answers them in the checklist run, not on this page.
const FollowUpChecklistSection = ({task}: FollowUpChecklistSectionProps) => {
  const isOpen = FOLLOW_UP_TASK_OPEN_STATUSES.includes(task.status);

  if (!isOpen && task.answers?.length)
    return <FollowUpAnswersCard answers={task.answers} />;

  if (!task.checklistTemplate) return null;

  return <FollowUpChecklistCard task={task} />;
};

export default FollowUpChecklistSection;
