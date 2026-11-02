'use client';

import {useEffect, useRef, useState} from 'react';

import HhaSyncAction from '@/shared/components/common/HhaSyncAction';
import {LIST_TYPES} from '@/shared/constants/general';
import {HHA_VISIT_DEFAULT_SORT} from '@/shared/constants/hhaVisits';
import {LIST_TAB_ALL, LIST_TAB_URL_KEY} from '@/shared/constants/listToolbar';
import {HHA_VISIT_LIST_TABS} from '@/shared/constants/listToolbarTabs';
import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useModal} from '@/shared/hooks/modals/useModal';
import {useHhaVisitListFilters} from '@/shared/hooks/useHhaVisitListFilters';
import {useListTabs} from '@/shared/hooks/useListTabs';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {HhaVisit, HhaVisitsTableProps} from '@/shared/interfaces/hhaVisit';
import {hhaVisitQueries} from '@/shared/reactQuery';
import HhaVisitDetailModal from '@/views/pages/hhaVisits/HhaVisitDetailModal';

import HhaVisitsTableUI from './HhaVisitsTableUI';

/**
 * Smart component for the HHA Visits table.
 *
 * Fetches the imported visits with server-side pagination, search and a
 * status filter, and opens a read-only detail dialog on row click. Nothing
 * here writes: the table is a one-way mirror of the HHAeXchange schedule and
 * the Sync button is the only thing that changes it.
 */
const HhaVisitsTable = ({title}: HhaVisitsTableProps) => {
  const {t} = useTranslation();
  const {isAdmin} = useUserRole();

  // Same gate as the other lists: only an admin may trigger a sync.
  const canSyncHhaExchange = isAdmin;

  const {useFetchHhaVisitsList} = hhaVisitQueries();

  const {tabs, tabParams} = useListTabs({
    urlKey: LIST_TAB_URL_KEY,
    ariaLabel: t('hhaVisits.tabs.ariaLabel'),
    options: HHA_VISIT_LIST_TABS,
    defaultValue: LIST_TAB_ALL,
  });

  const {filterParams, toolbarFilters} = useHhaVisitListFilters();

  const {
    filteredData: visits,
    isLoading,
    reactQueryData,
    tablePaginationProps,
    filters: {search},
    setFilters,
  } = useServerSideListFilters<HhaVisit>({
    listType: LIST_TYPES.hhaVisits,
    queryToCall: useFetchHhaVisitsList,
    dataKey: LIST_TYPES.hhaVisits.value,
    baseParams: {...HHA_VISIT_DEFAULT_SORT, ...tabParams, ...filterParams},
  });

  const {
    isModalOpen: isDetailOpen,
    openModal: openDetail,
    closeModal: closeDetail,
  } = useModal();

  const [selectedVisit, setSelectedVisit] = useState<HhaVisit | null>(null);

  // The selection is cleared a beat after the dialog closes so its content
  // does not blank mid fade-out. The pending clear is tracked so that opening
  // another row inside that window cannot wipe the new selection.
  const clearSelectionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const cancelPendingClear = () => clearTimeout(clearSelectionTimer.current);

  useEffect(() => cancelPendingClear, []);

  const handleRowClick = ({visit}: {visit: HhaVisit}) => {
    cancelPendingClear();
    setSelectedVisit(visit);
    openDetail();
  };

  const handleCloseDetail = () => {
    closeDetail();
    cancelPendingClear();
    clearSelectionTimer.current = setTimeout(
      () => setSelectedVisit(null),
      POST_MODAL_CLEANUP_DELAY
    );
  };

  return (
    <>
      <HhaVisitsTableUI
        visits={visits}
        isLoading={isLoading || reactQueryData.isFetching}
        title={title}
        paginationProps={tablePaginationProps}
        toolbar={{
          tabs,
          search: {
            value: search,
            onChange: ({val}) => setFilters({search: val}),
            placeholder: t('hhaVisits.table.searchPlaceholder'),
          },
          filters: toolbarFilters,
        }}
        actionSlot={canSyncHhaExchange ? <HhaSyncAction /> : undefined}
        onRowClick={handleRowClick}
      />

      <HhaVisitDetailModal
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        visit={selectedVisit}
      />
    </>
  );
};

export default HhaVisitsTable;
