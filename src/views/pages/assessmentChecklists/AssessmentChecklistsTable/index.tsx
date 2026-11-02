'use client';

import {LIST_TYPES} from '@/shared/constants/general';
import {LIST_TAB_ALL, LIST_TAB_URL_KEY} from '@/shared/constants/listToolbar';
import {ASSESSMENT_CHECKLIST_LIST_TABS} from '@/shared/constants/listToolbarTabs';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useModal} from '@/shared/hooks/modals/useModal';
import {useAssessmentChecklistFilters} from '@/shared/hooks/useAssessmentChecklistFilters';
import {useListTabs} from '@/shared/hooks/useListTabs';
import useTranslation from '@/shared/hooks/useTranslation';
import {AssessmentTemplateApi} from '@/shared/interfaces/assessmentChecklist';
import {TableTitleProps} from '@/shared/interfaces/tables';
import {assessmentQueries} from '@/shared/reactQuery';
import {transformAssessmentChecklistResponse} from '@/shared/utils/assessmentChecklistUtils';
import NewChecklistModal from '@/views/pages/assessmentChecklists/NewChecklistModal';

import AssessmentChecklistsTableUI from './AssessmentChecklistsTableUI';

const AssessmentChecklistsTable = ({title}: TableTitleProps) => {
  const {t} = useTranslation();
  const {useFetchAssessmentTemplatesList} = assessmentQueries();
  const {isModalOpen, openModal, closeModal} = useModal();

  const {tabs, tabParams} = useListTabs({
    urlKey: LIST_TAB_URL_KEY,
    ariaLabel: t('assessmentChecklists.tabs.ariaLabel'),
    options: ASSESSMENT_CHECKLIST_LIST_TABS,
    defaultValue: LIST_TAB_ALL,
  });

  const {filterParams, toolbarFilters} = useAssessmentChecklistFilters();

  const {
    filteredData: rawChecklists,
    isLoading,
    reactQueryData,
    tablePaginationProps,
  } = useServerSideListFilters<AssessmentTemplateApi>({
    listType: LIST_TYPES.assessmentChecklists,
    queryToCall: useFetchAssessmentTemplatesList,
    dataKey: LIST_TYPES.assessmentChecklists.value,
    baseParams: {...tabParams, ...filterParams},
  });

  const checklists = rawChecklists.map((checklist) =>
    transformAssessmentChecklistResponse({checklist})
  );

  return (
    <>
      <AssessmentChecklistsTableUI
        checklists={checklists}
        isLoading={isLoading || reactQueryData.isFetching}
        paginationProps={tablePaginationProps}
        title={title}
        toolbar={{tabs, filters: toolbarFilters}}
        onAddClick={openModal}
      />

      <NewChecklistModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default AssessmentChecklistsTable;
