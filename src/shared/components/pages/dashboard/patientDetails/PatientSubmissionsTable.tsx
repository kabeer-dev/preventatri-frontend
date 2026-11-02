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

interface PatientSubmissionsTableProps {
  patientId: string;
  includeDeleted?: boolean;

  title?: string;
  noRowsLabel?: string;
}

const PatientSubmissionsTable = ({
  patientId,
  includeDeleted = false,
  title,
  noRowsLabel,
}: PatientSubmissionsTableProps) => {
  const {t} = useTranslation();
  const {useFetchSubmissionsList} = assessmentQueries();

  // Archived patients have their submissions soft-deleted alongside them, so
  // only then do we ask the API to include soft-deleted rows to view them.
  const baseParams = Object.assign(
    {
      patientId,
      status: CHECKLIST_SUBMISSION_STATUS.SUBMITTED.value,
      ...SUB_ROUTE_PARAMS,
    },
    includeDeleted ? {includeDeleted: true} : {}
  );

  const {
    filteredData: rawSubmissions,
    isLoading,
    reactQueryData,
    tablePaginationProps,
  } = useServerSideListFilters<Submission>({
    listType: LIST_TYPES.submissions,
    queryToCall: useFetchSubmissionsList,
    dataKey: LIST_TYPES.submissions.value,
    baseParams,

    // Own URL namespace so pagination doesn't collide with the sibling
    // Recent Red Flags table on the same page.
    urlKeyPrefix: LIST_INSTANCE_KEYS.patientChecklistReports,
  });

  const submissions = rawSubmissions.map((submission: any) =>
    transformSubmissionResponse({submission})
  );

  return (
    <SubmissionsTableUI
      submissions={submissions}
      isLoading={isLoading || reactQueryData.isFetching}
      paginationProps={tablePaginationProps}
      title={title || t('patients.details.table.title')}
      hidePatientColumn
      alwaysShowCaregiverColumn
      hideActions
      noRowsLabel={noRowsLabel || t('patients.details.table.noRowsLabel')}
      titleInCard
    />
  );
};

export default PatientSubmissionsTable;
