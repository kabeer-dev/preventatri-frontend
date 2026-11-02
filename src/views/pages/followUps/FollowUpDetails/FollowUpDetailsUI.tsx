'use client';

import DetailSplitLayout from '@/shared/components/common/DetailSplitLayout';
import {FollowUpDetailsUIProps} from '@/shared/interfaces/followUp';

import FollowUpChecklistSection from './FollowUpChecklistSection';
import FollowUpDescriptionCard from './FollowUpDescriptionCard';
import FollowUpDetailsHeader from './FollowUpDetailsHeader';
import FollowUpHistoryCard from './FollowUpHistoryCard';
import FollowUpPatientCard from './FollowUpPatientCard';
import FollowUpSourceVisitCard from './FollowUpSourceVisitCard';
import FollowUpTaskFactsCard from './FollowUpTaskFactsCard';

const FollowUpDetailsUI = ({
  task,
  permissions,
  actions,
}: FollowUpDetailsUIProps) => (
  <>
    <FollowUpDetailsHeader
      task={task}
      permissions={permissions}
      actions={actions}
    />

    <DetailSplitLayout
      main={
        <>
          <FollowUpDescriptionCard task={task} />
          <FollowUpChecklistSection task={task} />
          <FollowUpHistoryCard events={task.events} />
        </>
      }
      rail={
        <>
          <FollowUpTaskFactsCard task={task} />
          <FollowUpPatientCard task={task} />
          {task.supervisoryVisit && (
            <FollowUpSourceVisitCard visit={task.supervisoryVisit} />
          )}
        </>
      }
    />
  </>
);

export default FollowUpDetailsUI;
