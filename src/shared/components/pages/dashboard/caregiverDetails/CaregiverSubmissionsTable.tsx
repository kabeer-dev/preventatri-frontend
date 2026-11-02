'use client';

import {CHECKLIST_SUBMISSION_STATUS} from '@/shared/constants/assessmentChecklists';
import {LIST_TYPES} from '@/shared/constants/general';
import {
  LIST_INSTANCE_KEYS,
  SUB_ROUTE_PARAMS,
} from '@/shared/constants/reactQueryConstants';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import useTranslation from '@/shared/hooks/useTranslation';
import {Submission} from '@/shared/interfaces/submission';
import {assessmentQueries} from '@/shared/reactQuery';
import {transformSubmissionResponse} from '@/shared/utils/submissionUtils';
import SubmissionsTableUI from '@/views/pages/submissions/SubmissionsTable/SubmissionsTableUI';

interface CaregiverSubmissionsTableProps {
  caregiverId: string;
}

const CaregiverSubmissionsTable = ({
  caregiverId,
}: CaregiverSubmissionsTableProps) => {
  const {t} = useTranslation();
  const {useFetchSubmissionsList} = assessmentQueries();

  const {
    filteredData: rawSubmissions,
    isLoading,
    reactQueryData,
    tablePaginationProps,
  } = useServerSideListFilters<Submission>({
    listType: LIST_TYPES.submissions,
    queryToCall: useFetchSubmissionsList,
    dataKey: LIST_TYPES.submissions.value,
    baseParams: {
      caregiverId,
      status: CHECKLIST_SUBMISSION_STATUS.SUBMITTED.value,
      ...SUB_ROUTE_PARAMS,
    },

    // Own URL namespace so pagination doesn't collide with the sibling
    // red flags and patients tables on the same page.
    urlKeyPrefix: LIST_INSTANCE_KEYS.caregiverChecklistReports,
  });

  const submissions = rawSubmissions.map((submission: any) =>
    transformSubmissionResponse({submission})
  );

  return (
    <SubmissionsTableUI
      submissions={submissions}
      isLoading={isLoading || reactQueryData.isFetching}
      paginationProps={tablePaginationProps}
      title={t('caregiver.details.submissionsTable.title')}
      titleInCard
      hideCaregiverColumn
      hideActions
      noRowsLabel={t('caregiver.details.submissionsTable.noRowsLabel')}
    />
  );
};

export default CaregiverSubmissionsTable;
