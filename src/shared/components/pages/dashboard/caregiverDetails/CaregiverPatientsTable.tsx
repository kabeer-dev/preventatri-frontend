'use client';

import DataTable from '@/shared/components/common/table/DataTable';
import {LIST_TYPES} from '@/shared/constants/general';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {PATIENT_SUMMARY_VIEW_PARAMS} from '@/shared/constants/patients';
import {
  LIST_INSTANCE_KEYS,
  SUB_ROUTE_PARAMS,
} from '@/shared/constants/reactQueryConstants';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {Patient} from '@/shared/interfaces/patient';
import {patientQueries} from '@/shared/reactQuery';
import {transformPatientResponse} from '@/shared/utils/patientUtils';

import {getCaregiverPatientColumns} from './columns';

interface CaregiverPatientsTableProps {
  caregiverId: string;
}

const CaregiverPatientsTable = ({caregiverId}: CaregiverPatientsTableProps) => {
  const {t} = useTranslation();
  const router = useLocaleRouter();
  const {useFetchPatientsList} = patientQueries();

  const {
    filteredData: rawPatients,
    isLoading,
    reactQueryData,
    tablePaginationProps,
  } = useServerSideListFilters<Patient>({
    listType: LIST_TYPES.patients,
    queryToCall: useFetchPatientsList,
    dataKey: LIST_TYPES.patients.value,
    baseParams: {
      caregiverId,
      ...PATIENT_SUMMARY_VIEW_PARAMS,
      ...SUB_ROUTE_PARAMS,
    },

    // Own URL namespace so pagination doesn't collide with the sibling
    // red flags and submissions tables on the same page.
    urlKeyPrefix: LIST_INSTANCE_KEYS.caregiverPatients,
  });

  const patients = rawPatients.map((patient: any) =>
    transformPatientResponse({patient})
  );

  const columns = getCaregiverPatientColumns({t});

  return (
    <DataTable<Patient>
      rows={patients}
      columns={columns}
      titleInCard
      title={t('caregiver.details.table.title')}
      loading={isLoading || reactQueryData.isFetching}
      noRowsLabel={t('caregiver.details.table.noRowsLabel')}
      serverSidePagination={tablePaginationProps}
      onRowClick={(params) =>
        router.push({
          url: DASHBOARD_ROUTES.patients.single({id: params.row.id}),
        })
      }
    />
  );
};

export default CaregiverPatientsTable;
