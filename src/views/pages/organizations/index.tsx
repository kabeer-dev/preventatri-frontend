'use client';

import {useState} from 'react';

import {
  ORGANIZATION_STATUS_TABS,
  ORGANIZATION_TAB_ALL,
} from '@/shared/constants/superAdmin';
import useDebounce from '@/shared/hooks/useDebounce';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  ManagedOrganization,
  OrganizationActionRequest,
} from '@/shared/interfaces/superAdmin';
import {superAdminMutations, superAdminQueries} from '@/shared/reactQuery';

import OrganizationActionDialog from './OrganizationActionDialog';
import OrganizationsTableUI from './OrganizationsTableUI';

const PAGE_SIZE_DEFAULT = 25;
const SEARCH_DEBOUNCE_MS = 500;

/**
 * Smart component for the super admin's organizations list.
 *
 * The status, search and pager are applied server-side, so the tabs, the
 * rows and the total always agree.
 */
const OrganizationsPage = () => {
  const {t} = useTranslation();

  const [status, setStatus] = useState<string>(ORGANIZATION_TAB_ALL);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE_DEFAULT);

  const [request, setRequest] = useState<OrganizationActionRequest | null>(
    null
  );

  const debouncedSearch = useDebounce({
    value: search.trim(),
    delay: SEARCH_DEBOUNCE_MS,
  });

  const {useFetchManagedOrganizations} = superAdminQueries();
  const {useOrganizationActionMutation} = superAdminMutations();

  const {data, isLoading, isFetching} = useFetchManagedOrganizations({
    params: {
      status: status === ORGANIZATION_TAB_ALL ? undefined : status,
      search: debouncedSearch,
      page,
      limit,
    },
  });

  const {mutate: runAction, isPending} = useOrganizationActionMutation();

  const organizations: ManagedOrganization[] =
    data?.result?.organizations ?? [];

  const handleStatusChange = ({value}: {value: string}) => {
    setStatus(value);
    setPage(1);
  };

  const handleSearchChange = ({val}: {val: string}) => {
    setSearch(val);
    setPage(1);
  };

  const handleConfirm = ({reason}: {reason?: string}) => {
    if (!request) return;

    const {organization, action} = request;

    runAction({
      params: {id: organization.id, action},
      payload: reason ? {reason} : undefined,
      toastConfig: {success: {customMessage: t(`superAdmin.toast.${action}`)}},
      callBackFuncs: {onSuccess: () => setRequest(null)},
    });
  };

  return (
    <>
      <OrganizationsTableUI
        organizations={organizations}
        isLoading={isLoading || isFetching}
        onAction={setRequest}
        toolbar={{
          tabs: {
            value: status,
            ariaLabel: t('superAdmin.tabs.ariaLabel'),
            options: [
              {value: ORGANIZATION_TAB_ALL, label: t('superAdmin.tabs.all')},
              ...ORGANIZATION_STATUS_TABS.map((value) => ({
                value,
                label: t(`superAdmin.tabs.${value}`),
              })),
            ],
            onChange: handleStatusChange,
          },
          search: {
            value: search,
            onChange: handleSearchChange,
            placeholder: t('superAdmin.table.searchPlaceholder'),
          },
        }}
        paginationProps={{
          page: Math.max(page - 1, 0),
          pageSize: limit,
          rowCount: data?.result?.meta?.total ?? 0,
          onPaginationModelChange: (model) => {
            setPage(model.page + 1);
            setLimit(model.pageSize);
          },
        }}
      />

      <OrganizationActionDialog
        request={request}
        isLoading={isPending}
        onClose={() => setRequest(null)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default OrganizationsPage;
