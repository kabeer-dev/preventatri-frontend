'use client';

import {LIST_TYPES} from '@/shared/constants/general';
import {LIST_TAB_ALL, LIST_TAB_URL_KEY} from '@/shared/constants/listToolbar';
import {SUBMISSION_LIST_TABS} from '@/shared/constants/listToolbarTabs';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useListTabs} from '@/shared/hooks/useListTabs';
import {useSubmissionActions} from '@/shared/hooks/useSubmissionActions';
import {useSubmissionFilters} from '@/shared/hooks/useSubmissionFilters';
import useTranslation from '@/shared/hooks/useTranslation';
import {Submission, SubmissionResponse} from '@/shared/interfaces/submission';
import {assessmentQueries} from '@/shared/reactQuery';
import {transformSubmissionResponse} from '@/shared/utils/submissionUtils';
import SubmissionActionDialogs from '@/views/pages/submissions/SubmissionActionDialogs';

import SubmissionsTableUI from './SubmissionsTableUI';

// The page title already sits in the top bar, so the table carries no heading
// of its own.
const SubmissionsTable = () => {
  const {t} = useTranslation();

  const {tabs, tabParams} = useListTabs({
    urlKey: LIST_TAB_URL_KEY,
    ariaLabel: t('submissions.tabs.ariaLabel'),
    options: SUBMISSION_LIST_TABS,
    defaultValue: LIST_TAB_ALL,
  });

  const {filterParams, toolbarFilters} = useSubmissionFilters();

  const {useFetchSubmissionsList} = assessmentQueries();

  const {
    filteredData: rawSubmissions,
    isLoading,
    reactQueryData,
    tablePaginationProps,
    filters: {search},
    setFilters,
  } = useServerSideListFilters<SubmissionResponse>({
    listType: LIST_TYPES.submissions,
    queryToCall: useFetchSubmissionsList,
    dataKey: LIST_TYPES.submissions.value,
    baseParams: Object.assign({}, tabParams, filterParams),
  });

  const submissions = rawSubmissions.map((submission) =>
    transformSubmissionResponse({submission})
  );

  const actions = useSubmissionActions();

  const openForRow =
    ({open}: {open: typeof actions.open.void}) =>
    ({id}: {id: string}) => {
      const row = submissions.find((submission) => submission.id === id);

      if (row) open({submission: toActionTarget({row})});
    };

  return (
    <>
      <SubmissionsTableUI
        submissions={submissions}
        isLoading={isLoading || reactQueryData.isFetching}
        onVoidSubmission={openForRow({open: actions.open.void})}
        onSkipSubmission={openForRow({open: actions.open.skip})}
        paginationProps={tablePaginationProps}
        toolbar={{
          tabs,
          search: {
            value: search,
            onChange: ({val}) => setFilters({search: val}),
            placeholder: t('submissions.table.searchPlaceholder'),
          },
          filters: toolbarFilters,
        }}
      />

      <SubmissionActionDialogs
        target={actions.target}
        modals={actions.modals}
        handlers={actions.handlers}
        pending={actions.pending}
      />
    </>
  );
};

const toActionTarget = ({row}: {row: Submission}) => ({
  id: row.id,
  name: row.checklistName,
  patientId: row.patientId,
  patient: null,
});

export default SubmissionsTable;
