'use client';

import DataTable from '@/shared/components/common/table/DataTable';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  ManagedOrganization,
  OrganizationsTableUIProps,
} from '@/shared/interfaces/superAdmin';

import {getOrganizationColumns} from './columns';

/** Presentational shell for the super admin's organizations list. */
const OrganizationsTableUI = ({
  organizations,
  isLoading,
  toolbar,
  paginationProps,
  onAction,
}: OrganizationsTableUIProps) => {
  const {t} = useTranslation();

  return (
    <DataTable<ManagedOrganization>
      rows={organizations}
      columns={getOrganizationColumns({t, onAction})}
      loading={isLoading}
      noRowsLabel={t('superAdmin.table.noRowsLabel')}
      serverSidePagination={paginationProps}
      toolbar={toolbar}
    />
  );
};

export default OrganizationsTableUI;
