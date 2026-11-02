'use client';

import {useState} from 'react';

import {VoidReasonModal} from '@/shared/components/common/modals/VoidReasonModal';
import {LIST_TYPES} from '@/shared/constants/general';
import {LIST_TAB_ALL, LIST_TAB_URL_KEY} from '@/shared/constants/listToolbar';
import {EMERGENCY_FLAG_LIST_TABS} from '@/shared/constants/listToolbarTabs';
import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useModal} from '@/shared/hooks/modals/useModal';
import {useEmergencyFlagFilters} from '@/shared/hooks/useEmergencyFlagFilters';
import {useListTabs} from '@/shared/hooks/useListTabs';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  EmergencyFlagListItem,
  RawEmergencyFlagResponse,
} from '@/shared/interfaces/emergencyFlag';
import {TableTitleProps} from '@/shared/interfaces/tables';
import {assessmentMutations, assessmentQueries} from '@/shared/reactQuery';
import {transformRedFlagResponse} from '@/shared/utils/redFlagUtils';

import EmergencyFlagsTableUI from './EmergencyFlagsTableUI';

const EmergencyFlagsTable = ({title}: TableTitleProps) => {
  const {t} = useTranslation();

  const {tabs, tabParams} = useListTabs({
    urlKey: LIST_TAB_URL_KEY,
    ariaLabel: t('emergencyFlags.tabs.ariaLabel'),
    options: EMERGENCY_FLAG_LIST_TABS,
    defaultValue: LIST_TAB_ALL,
  });

  const {filterParams, toolbarFilters} = useEmergencyFlagFilters();

  const {useFetchEmergencyFlagsList} = assessmentQueries();

  const {
    filteredData: rawEmergencyFlags,
    isLoading,
    reactQueryData,
    tablePaginationProps,
    filters: {search},
    setFilters,
  } = useServerSideListFilters<EmergencyFlagListItem>({
    listType: LIST_TYPES.emergencyFlags,
    queryToCall: useFetchEmergencyFlagsList,
    dataKey: LIST_TYPES.emergencyFlags.value,
    baseParams: {...tabParams, ...filterParams},
  });

  const emergencyFlags = rawEmergencyFlags.map(
    (emergencyFlag: RawEmergencyFlagResponse) =>
      transformRedFlagResponse({redFlag: emergencyFlag})
  );

  const {useVoidEmergencyFlagMutation} = assessmentMutations();
  const {mutate: voidEmergencyFlag} = useVoidEmergencyFlagMutation();

  const {
    isModalOpen: isVoidModalOpen,
    closeModal: closeVoidModal,
    openModal: openVoidModal,
  } = useModal();

  const [selectedEmergencyFlag, setSelectedEmergencyFlag] =
    useState<EmergencyFlagListItem | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const handleAction = () => {};

  const handleVoidEmergencyFlag = ({id}: {id: string}) => {
    const emergencyFlag = emergencyFlags.find((flag) => flag.id === id);

    if (emergencyFlag) {
      setSelectedEmergencyFlag(emergencyFlag);
      openVoidModal();
    }
  };

  const handleConfirmVoid = ({reason}: {reason: string}) => {
    if (!selectedEmergencyFlag?.id) return;

    setIsMutating(true);
    voidEmergencyFlag({
      params: {id: selectedEmergencyFlag.id},
      payload: {voidReason: reason},
      callBackFuncs: {
        onSuccess: handleCancelVoid,
        onError: () => setIsMutating(false),
      },
    });
  };

  const clearSelectedEmergencyFlag = () => {
    setTimeout(() => {
      setSelectedEmergencyFlag(null);
      setIsMutating(false);
    }, POST_MODAL_CLEANUP_DELAY);
  };

  const handleCancelVoid = () => {
    closeVoidModal();
    clearSelectedEmergencyFlag();
  };

  const emergencyFlagDisplayName = selectedEmergencyFlag?.patientName || '';

  return (
    <>
      <EmergencyFlagsTableUI
        emergencyFlags={emergencyFlags}
        isLoading={isLoading || reactQueryData.isFetching}
        onEditEmergencyFlag={handleAction}
        onVoidEmergencyFlag={handleVoidEmergencyFlag}
        title={title}
        paginationProps={tablePaginationProps}
        toolbar={{
          tabs,
          search: {
            value: search,
            onChange: ({val}) => setFilters({search: val}),
            placeholder: t('emergencyFlags.table.searchPlaceholder'),
          },
          filters: toolbarFilters,
        }}
      />

      <VoidReasonModal
        isOpen={isVoidModalOpen}
        title={t('emergencyFlags.voidTitle')}
        description={t('emergencyFlags.voidMessage', {
          name: emergencyFlagDisplayName,
        })}
        onCancel={handleCancelVoid}
        onConfirm={handleConfirmVoid}
        confirmLoading={isMutating}
      />
    </>
  );
};

export default EmergencyFlagsTable;
