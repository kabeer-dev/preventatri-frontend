'use client';

import {useMemo} from 'react';

import {FILTER_PARAMS, LIST_TYPES} from '@/shared/constants/general';
import {
  LIST_FILTER_ICONS,
  LIST_FILTER_KINDS,
  LIST_TAB_ALL,
  LIST_TAB_URL_KEY,
} from '@/shared/constants/listToolbar';
import {
  buildSupervisoryVisitListTabs,
  SUPERVISORY_VISIT_UNSUPPORTED_FILTERS,
} from '@/shared/constants/listToolbarTabs';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {
  SUPERVISORY_VISIT_LIST_DEFAULT_SORT,
  SUPERVISORY_VISIT_TYPE,
} from '@/shared/constants/supervisoryVisits';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useModal} from '@/shared/hooks/modals/useModal';
import {useNurseFilterOptions} from '@/shared/hooks/useFilterEntityOptions';
import {useListTabs} from '@/shared/hooks/useListTabs';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import {useTaskListFilters} from '@/shared/hooks/useTaskListFilters';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {ListFilterFieldConfig} from '@/shared/interfaces/listToolbar';
import {SupervisoryVisit} from '@/shared/interfaces/supervisoryVisit';
import {
  supervisoryVisitMutations,
  supervisoryVisitQueries,
} from '@/shared/reactQuery';
import {SupervisoryVisitFormPayload} from '@/shared/types/supervisoryVisit';
import {
  buildSupervisoryVisitPayload,
  getWeekRangeParams,
} from '@/shared/utils/supervisoryVisitUtils';
import SupervisoryVisitFormModal from '@/views/pages/supervisoryVisits/SupervisoryVisitFormModal';

import SupervisoryVisitsTableUI from './SupervisoryVisitsTableUI';

const SupervisoryVisitsTable = () => {
  const {t} = useTranslation();
  const router = useLocaleRouter();
  const {isAdmin, isNurse, isCaseManager} = useUserRole();
  const {zone} = useOrganizationTimeZone();
  const canCreate = isAdmin || isNurse || isCaseManager;

  const {useFetchSupervisoryVisitsList} = supervisoryVisitQueries();
  const {useCreateSupervisoryVisitMutation} = supervisoryVisitMutations();

  const {mutate: createVisit, isPending: isCreating} =
    useCreateSupervisoryVisitMutation();

  // The week window (organization clock) is fixed for the page's lifetime; a
  // tab is not a clock.
  const tabOptions = useMemo(
    () => buildSupervisoryVisitListTabs(getWeekRangeParams({zone})),
    [zone]
  );

  const {tabs, tabParams} = useListTabs({
    urlKey: LIST_TAB_URL_KEY,
    ariaLabel: t('supervisoryVisits.tabs.ariaLabel'),
    options: tabOptions,
    defaultValue: LIST_TAB_ALL,
  });

  // The nurses list is admin-only; other roles see their own visits anyway.
  const nurseOptions = useNurseFilterOptions({enabled: isAdmin});

  const extraFields: ListFilterFieldConfig[] = useMemo(
    () => [
      {
        param: FILTER_PARAMS.visitType,
        label: t('filters.visitType'),
        icon: LIST_FILTER_ICONS.visitType,
        kind: LIST_FILTER_KINDS.single,
        options: Object.values(SUPERVISORY_VISIT_TYPE).map((type) => ({
          value: type.value,
          label: t(type.labelKey),
        })),
      },
      {
        param: FILTER_PARAMS.assigneeUser,
        label: t('filters.nurse'),
        icon: LIST_FILTER_ICONS.nurse,
        kind: LIST_FILTER_KINDS.single,
        searchable: true,
        ...nurseOptions,
        visible: isAdmin,
      },
    ],
    [t, nurseOptions, isAdmin]
  );

  const {filterParams, toolbarFilters} = useTaskListFilters({
    includeCaseManager: false,
    extraFields,
    unsupportedFields: SUPERVISORY_VISIT_UNSUPPORTED_FILTERS,
  });

  const {
    isModalOpen: isCreateOpen,
    openModal: openCreate,
    closeModal: closeCreate,
  } = useModal();

  const {
    filteredData: visits,
    isLoading,
    reactQueryData,
    tablePaginationProps,
    filters: {search},
    setFilters,
  } = useServerSideListFilters<SupervisoryVisit>({
    listType: LIST_TYPES.supervisoryVisits,
    queryToCall: useFetchSupervisoryVisitsList,
    dataKey: 'visits',
    baseParams: Object.assign(
      {},
      SUPERVISORY_VISIT_LIST_DEFAULT_SORT,
      tabParams,
      filterParams
    ),
  });

  const handleRowClick = ({visit}: {visit: SupervisoryVisit}) => {
    router.push({
      url: DASHBOARD_ROUTES.supervisoryVisits.single({id: visit.id}),
    });
  };

  const handleCreate = (values: SupervisoryVisitFormPayload) => {
    createVisit({
      payload: buildSupervisoryVisitPayload({values, zone}),
      callBackFuncs: {onSuccess: () => closeCreate()},
    });
  };

  return (
    <>
      <SupervisoryVisitsTableUI
        visits={visits}
        isLoading={isLoading || reactQueryData.isFetching}
        paginationProps={tablePaginationProps}
        toolbar={{
          tabs,
          search: {
            value: search,
            onChange: ({val}) => setFilters({search: val}),
            placeholder: t('supervisoryVisits.table.searchPlaceholder'),
          },
          filters: toolbarFilters,
        }}
        onRowClick={handleRowClick}
        onAddClick={openCreate}
        canCreate={canCreate}
      />

      <SupervisoryVisitFormModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
    </>
  );
};

export default SupervisoryVisitsTable;
