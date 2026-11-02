'use client';

import {useState} from 'react';

import HhaCoordinatorPickerModal from '@/shared/components/common/hhaSync/HhaCoordinatorPickerModal';
import DataTable from '@/shared/components/common/table/DataTable';
import {LIST_TYPES} from '@/shared/constants/general';
import {
  HHA_COORDINATOR_CHOICE_FILTERS,
  HHA_SYNC_AUTO_ROW_HEIGHT,
  HHA_SYNC_URL_KEYS,
} from '@/shared/constants/hhaSyncHistory';
import {HHA_SYNC_COORDINATOR_TABS} from '@/shared/constants/listToolbarTabs';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useModal} from '@/shared/hooks/modals/useModal';
import {useListTabs} from '@/shared/hooks/useListTabs';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  HhaCoordinatorPatient,
  HhaCoordinatorPickerTarget,
} from '@/shared/interfaces/hhaSyncHistory';
import {hhaExchangeQueries} from '@/shared/reactQuery';

import {getHhaCoordinatorColumns} from './columns';

// Patients HHAeXchange gives more than one coordinator: an admin picks which
// one is the case manager here; the first is used until then.
const HhaSyncCoordinatorsTable = () => {
  const {t} = useTranslation();
  const {useFetchHhaCoordinatorPatientsList} = hhaExchangeQueries();

  const {tabs, tabParams} = useListTabs({
    urlKey: HHA_SYNC_URL_KEYS.coordinatorChoice,
    ariaLabel: t('hhaSyncHistory.tabs.coordinatorChoiceAriaLabel'),
    options: HHA_SYNC_COORDINATOR_TABS,
    defaultValue: HHA_COORDINATOR_CHOICE_FILTERS.needsChoice.value,
  });

  const {
    filteredData: patients,
    isLoading,
    reactQueryData,
    tablePaginationProps,
  } = useServerSideListFilters<HhaCoordinatorPatient>({
    listType: LIST_TYPES.coordinatorPatients,
    queryToCall: useFetchHhaCoordinatorPatientsList,
    dataKey: LIST_TYPES.coordinatorPatients.value,
    baseParams: tabParams,
    urlKeyPrefix: HHA_SYNC_URL_KEYS.coordinatorsPrefix,
  });

  const {isModalOpen, openModal, closeModal} = useModal();
  const [target, setTarget] = useState<HhaCoordinatorPickerTarget | null>(null);

  return (
    <>
      <DataTable<HhaCoordinatorPatient>
        rows={patients}
        columns={getHhaCoordinatorColumns({
          t,
          onChoose: (next) => {
            setTarget(next);
            openModal();
          },
        })}
        getRowId={(row) => row.patientId}
        loading={isLoading || reactQueryData.isFetching}
        noRowsLabel={t('hhaSyncHistory.coordinators.noRowsLabel')}
        serverSidePagination={tablePaginationProps}
        toolbar={{tabs}}
        gridSx={{'& .MuiDataGrid-cell': {alignItems: 'flex-start'}}}
        getRowHeight={() => HHA_SYNC_AUTO_ROW_HEIGHT}
      />

      <HhaCoordinatorPickerModal
        key={isModalOpen ? target?.patientId : 'closed'}
        target={target}
        isOpen={isModalOpen && Boolean(target)}
        onClose={closeModal}
      />
    </>
  );
};

export default HhaSyncCoordinatorsTable;
