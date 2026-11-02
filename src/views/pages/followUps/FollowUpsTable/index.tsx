'use client';

import {useMemo} from 'react';

import {
  FOLLOW_UP_LIST_DEFAULT_SORT,
  FOLLOW_UP_OVERDUE_SUMMARY_PARAMS,
  FOLLOW_UP_TASK_FLAG_TYPES,
  FOLLOW_UP_TASK_PRIORITY,
  FOLLOW_UP_TASK_SOURCE,
} from '@/shared/constants/followUps';
import {FILTER_PARAMS, LIST_TYPES} from '@/shared/constants/general';
import {
  LIST_FILTER_ICONS,
  LIST_FILTER_KINDS,
  LIST_TAB_ALL,
  LIST_TAB_URL_KEY,
} from '@/shared/constants/listToolbar';
import {
  FOLLOW_UP_LIST_TABS,
  FOLLOW_UP_OVERDUE_TAB,
} from '@/shared/constants/listToolbarTabs';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useModal} from '@/shared/hooks/modals/useModal';
import {useListTabs} from '@/shared/hooks/useListTabs';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import {useTaskListFilters} from '@/shared/hooks/useTaskListFilters';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {
  FollowUpOverdueSummary,
  FollowUpTask,
} from '@/shared/interfaces/followUp';
import {ListFilterFieldConfig} from '@/shared/interfaces/listToolbar';
import {followUpTaskMutations, followUpTaskQueries} from '@/shared/reactQuery';
import {FollowUpFormPayload} from '@/shared/types/followUp';
import {buildFollowUpPayload} from '@/shared/utils/followUpUtils';
import FollowUpFormModal from '@/views/pages/followUps/FollowUpFormModal';

import FollowUpsTableUI from './FollowUpsTableUI';

const FollowUpsTable = () => {
  const {t} = useTranslation();
  const router = useLocaleRouter();
  const {isAdmin, isNurse, isCaseManager} = useUserRole();
  const {zone} = useOrganizationTimeZone();

  const {useFetchFollowUpTasksList} = followUpTaskQueries();
  const {useCreateFollowUpTaskMutation} = followUpTaskMutations();

  const {mutate: createTask, isPending: isCreatingTask} =
    useCreateFollowUpTaskMutation();

  const {tabs, tabParams} = useListTabs({
    urlKey: LIST_TAB_URL_KEY,
    ariaLabel: t('followUps.tabs.ariaLabel'),
    options: FOLLOW_UP_LIST_TABS,
    defaultValue: LIST_TAB_ALL,
  });

  const extraFields: ListFilterFieldConfig[] = useMemo(
    () => [
      {
        param: FILTER_PARAMS.priority,
        label: t('followUps.filters.priority'),
        icon: LIST_FILTER_ICONS.severity,
        kind: LIST_FILTER_KINDS.single,
        options: Object.values(FOLLOW_UP_TASK_PRIORITY).map((priority) => ({
          value: priority.value,
          label: t(priority.labelKey),
        })),
      },
      {
        param: FILTER_PARAMS.source,
        label: t('followUps.filters.source'),
        icon: LIST_FILTER_ICONS.source,
        kind: LIST_FILTER_KINDS.single,
        options: Object.values(FOLLOW_UP_TASK_SOURCE).map((source) => ({
          value: source.value,
          label: t(source.labelKey),
        })),
      },
    ],
    [t]
  );

  const {filterParams, toolbarFilters} = useTaskListFilters({
    flagTypeConstant: FOLLOW_UP_TASK_FLAG_TYPES,
    i18nNamespace: 'followUps',
    includeCaseManager: false,
    extraFields,
  });

  const {
    isModalOpen: isCreateOpen,
    openModal: openCreate,
    closeModal: closeCreate,
  } = useModal();

  const {
    filteredData: tasks,
    isLoading,
    reactQueryData,
    tablePaginationProps,
    filters: {search},
    setFilters,
  } = useServerSideListFilters<FollowUpTask>({
    listType: LIST_TYPES.followUps,
    queryToCall: useFetchFollowUpTasksList,
    dataKey: 'tasks',
    baseParams: Object.assign(
      {},
      FOLLOW_UP_LIST_DEFAULT_SORT,
      tabParams,
      filterParams
    ),
  });

  // One-row query: the overdue count plus the oldest due date for the banner.
  const overdueQuery = useFetchFollowUpTasksList({
    params: FOLLOW_UP_OVERDUE_SUMMARY_PARAMS,
  });

  const overdueSummary: FollowUpOverdueSummary | null = useMemo(() => {
    const count: number = overdueQuery.data?.meta?.count ?? 0;
    if (!count) return null;

    const oldest: FollowUpTask | undefined = overdueQuery.data?.tasks?.[0];

    return {count, oldestDueAt: oldest?.dueAt ?? null};
  }, [overdueQuery.data]);

  const handleRowClick = ({task}: {task: FollowUpTask}) => {
    router.push({url: DASHBOARD_ROUTES.followUps.single({id: task.id})});
  };

  const handleCreate = (data: FollowUpFormPayload) => {
    createTask({
      payload: buildFollowUpPayload({values: data, zone}),
      callBackFuncs: {onSuccess: () => closeCreate()},
    });
  };

  return (
    <>
      <FollowUpsTableUI
        tasks={tasks}
        isLoading={isLoading || reactQueryData.isFetching}
        paginationProps={tablePaginationProps}
        toolbar={{
          tabs,
          search: {
            value: search,
            onChange: ({val}) => setFilters({search: val}),
            placeholder: t('followUps.table.searchPlaceholder'),
          },
          filters: toolbarFilters,
        }}
        onRowClick={handleRowClick}
        onAddClick={openCreate}
        canCreate={isAdmin || isNurse || isCaseManager}
        overdueSummary={overdueSummary}
        onShowOverdue={() => tabs.onChange({value: FOLLOW_UP_OVERDUE_TAB})}
      />

      <FollowUpFormModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onSubmit={handleCreate}
        isLoading={isCreatingTask}
      />
    </>
  );
};

export default FollowUpsTable;
