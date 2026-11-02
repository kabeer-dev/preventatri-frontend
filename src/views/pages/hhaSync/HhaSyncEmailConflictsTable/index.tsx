'use client';

import {useState} from 'react';

import DataTable from '@/shared/components/common/table/DataTable';
import {LIST_TYPES} from '@/shared/constants/general';
import {
  HHA_EMAIL_CONFLICT_FILTERS,
  HHA_SYNC_AUTO_ROW_HEIGHT,
  HHA_SYNC_URL_KEYS,
} from '@/shared/constants/hhaSyncHistory';
import {HHA_SYNC_EMAIL_CONFLICT_TABS} from '@/shared/constants/listToolbarTabs';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useModal} from '@/shared/hooks/modals/useModal';
import {useListTabs} from '@/shared/hooks/useListTabs';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  HhaEmailChangeTarget,
  HhaEmailConflict,
} from '@/shared/interfaces/hhaSyncHistory';
import {hhaExchangeQueries} from '@/shared/reactQuery';
import HhaSyncChangeEmailModal from '@/views/pages/hhaSync/HhaSyncChangeEmailModal';

import {getHhaEmailConflictColumns} from './columns';

// People HHAeXchange gives the same email: one row per address, so an admin
// can give each of them their own login email.
const HhaSyncEmailConflictsTable = () => {
  const {t} = useTranslation();
  const {useFetchHhaEmailConflictsList} = hhaExchangeQueries();

  const {tabs, tabParams} = useListTabs({
    urlKey: HHA_SYNC_URL_KEYS.emailStatus,
    ariaLabel: t('hhaSyncHistory.tabs.emailStatusAriaLabel'),
    options: HHA_SYNC_EMAIL_CONFLICT_TABS,
    defaultValue: HHA_EMAIL_CONFLICT_FILTERS.needsAttention.value,
  });

  const {
    filteredData: conflicts,
    isLoading,
    reactQueryData,
    tablePaginationProps,
  } = useServerSideListFilters<HhaEmailConflict>({
    listType: LIST_TYPES.emailConflicts,
    queryToCall: useFetchHhaEmailConflictsList,
    dataKey: LIST_TYPES.emailConflicts.value,
    baseParams: tabParams,
    urlKeyPrefix: HHA_SYNC_URL_KEYS.emailsPrefix,
  });

  const {isModalOpen, openModal, closeModal} = useModal();
  const [target, setTarget] = useState<HhaEmailChangeTarget | null>(null);

  return (
    <>
      <DataTable<HhaEmailConflict>
        rows={conflicts}
        columns={getHhaEmailConflictColumns({
          t,
          onChangeEmail: (next) => {
            setTarget(next);
            openModal();
          },
        })}
        getRowId={(row) => row.email}
        loading={isLoading || reactQueryData.isFetching}
        noRowsLabel={t('hhaSyncHistory.emails.noRowsLabel')}
        serverSidePagination={tablePaginationProps}
        toolbar={{tabs}}
        gridSx={{'& .MuiDataGrid-cell': {alignItems: 'flex-start'}}}
        getRowHeight={() => HHA_SYNC_AUTO_ROW_HEIGHT}
      />

      <HhaSyncChangeEmailModal
        key={isModalOpen ? target?.member.userId : 'closed'}
        target={target}
        isOpen={isModalOpen && Boolean(target)}
        onClose={closeModal}
      />
    </>
  );
};

export default HhaSyncEmailConflictsTable;
