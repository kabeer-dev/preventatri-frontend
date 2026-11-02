'use client';

import {useEffect, useState} from 'react';

import {DeleteConfirmationModal} from '@/shared/components/common/modals/DeleteConfirmationModal';
import {LIST_TYPES} from '@/shared/constants/general';
import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useModal} from '@/shared/hooks/modals/useModal';
import {useRegionListTabs} from '@/shared/hooks/useRegionListTabs';
import useTranslation from '@/shared/hooks/useTranslation';
import {Region, RegionMutationPayload} from '@/shared/interfaces/region';
import {EntityTableProps} from '@/shared/interfaces/tables';
import {regionQueries, regionMutations} from '@/shared/reactQuery';
import RegionModal from '@/views/pages/regions/RegionModal';

import RegionsListUI from './RegionsListUI';

/**
 * Smart component for the regions list
 * Fetches data with server-side pagination and handles business logic
 */

const RegionsList = ({
  showAddButton = true,
  addButtonText,
}: EntityTableProps) => {
  const {t} = useTranslation();
  const resolvedAddButtonText = addButtonText || t('region.table.addButton');

  const {tabs, tabParams} = useRegionListTabs();

  // Queries — server-side filtered list
  const {useFetchRegionsList} = regionQueries();

  const {
    filteredData: regions,
    isLoading,
    reactQueryData,
    tablePaginationProps,
    filters: {search},
    setFilters,
  } = useServerSideListFilters<Region>({
    listType: LIST_TYPES.regions,
    queryToCall: useFetchRegionsList,
    dataKey: LIST_TYPES.regions.value,
    baseParams: tabParams,
  });

  useEffect(() => {
    if (search) setFilters({search: ''});
  }, [search, setFilters]);

  // Mutations
  const {
    useCreateRegionMutation,
    useUpdateRegionMutation,
    useDeleteRegionMutation,
  } = regionMutations();

  const {mutate: createRegion} = useCreateRegionMutation();

  const {mutate: updateRegion} = useUpdateRegionMutation();

  const {mutate: deleteRegion} = useDeleteRegionMutation();

  // Region drawer state (Add/Edit)
  const {
    isModalOpen: isRegionModalOpen,
    closeModal: closeRegionModal,
    openModal: openRegionModal,
  } = useModal();

  // Delete modal state
  const {
    isModalOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    openModal: openDeleteModal,
  } = useModal();

  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const handleAddRegion = () => {
    setSelectedRegion(null);
    openRegionModal();
  };

  const handleEditRegion = ({id}: {id: string}) => {
    const region = regions.find((r) => r.id === id);

    if (region) {
      setSelectedRegion(region);
      openRegionModal();
    }
  };

  const handleDeleteRegion = ({id}: {id: string}) => {
    const region = regions.find((r) => r.id === id);

    if (region) {
      setSelectedRegion(region);
      openDeleteModal();
    }
  };

  const handleConfirmDelete = () => {
    if (!selectedRegion?.id) return;

    setIsMutating(true);
    deleteRegion({
      params: {id: selectedRegion.id},
      callBackFuncs: {
        onSuccess: handleCancelDelete,
        onError: () => setIsMutating(false),
      },
    });
  };

  const clearRegion = () => {
    setTimeout(() => {
      setSelectedRegion(null);
      setIsMutating(false);
    }, POST_MODAL_CLEANUP_DELAY);
  };

  const handleCancelDelete = () => {
    closeDeleteModal();
    clearRegion();
  };

  const handleCloseRegionModal = () => {
    closeRegionModal();
    clearRegion();
  };

  const handleSubmitRegion = (data: RegionMutationPayload) => {
    setIsMutating(true);

    const callBackFuncs = {
      onSuccess: handleCloseRegionModal,
      onError: () => setIsMutating(false),
    };

    if (selectedRegion?.id) {
      updateRegion({
        payload: data,
        params: {id: selectedRegion.id},
        callBackFuncs,
      });
    } else {
      createRegion({payload: data, callBackFuncs});
    }
  };

  const regionDisplayName = selectedRegion ? selectedRegion.name : '';

  return (
    <>
      <RegionsListUI
        regions={regions}
        tabs={tabs}
        isLoading={isLoading || reactQueryData.isFetching}
        showAddButton={showAddButton}
        addButtonText={resolvedAddButtonText}
        paginationProps={tablePaginationProps}
        onAddRegion={handleAddRegion}
        onEditRegion={handleEditRegion}
        onDeleteRegion={handleDeleteRegion}
      />

      <RegionModal
        isOpen={isRegionModalOpen}
        onClose={handleCloseRegionModal}
        onSubmit={handleSubmitRegion}
        isLoading={isMutating}
        region={selectedRegion}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title={t('region.deleteTitle')}
        content={[t('region.deleteMessage', {name: regionDisplayName})]}
        dismissLabel={t('region.cancelButton')}
        deleteLabel={t('region.deleteButton')}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
        deleteLoading={isMutating}
        onClose={handleCancelDelete}
      />
    </>
  );
};

export default RegionsList;
