'use client';

import SegmentedTabs from '@/shared/components/common/inputs/SegmentedTabs';
import {LIST_TYPES} from '@/shared/constants/general';
import {
  EMERGENCY_FLAG_OPEN_TAB,
  PATIENT_ALERT_TABS,
  PATIENT_ALERTS_TAB_URL_KEY,
} from '@/shared/constants/listToolbarTabs';
import {
  LIST_INSTANCE_KEYS,
  SUB_ROUTE_PARAMS,
} from '@/shared/constants/reactQueryConstants';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import {useListTabs} from '@/shared/hooks/useListTabs';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  EmergencyFlagListItem,
  RawEmergencyFlagResponse,
} from '@/shared/interfaces/emergencyFlag';
import {assessmentQueries} from '@/shared/reactQuery';
import {transformRedFlagResponse} from '@/shared/utils/redFlagUtils';
import EmergencyFlagsTableUI from '@/views/pages/emergencyFlags/EmergencyFlagsTable/EmergencyFlagsTableUI';

interface PatientEmergencyFlagsTableProps {
  patientId: string;

  title?: string;
  noRowsLabel?: string;
}

const PatientEmergencyFlagsTable = ({
  patientId,
  title,
  noRowsLabel,
}: PatientEmergencyFlagsTableProps) => {
  const {t} = useTranslation();
  const {useFetchEmergencyFlagsList} = assessmentQueries();

  const {tabs, tabParams} = useListTabs({
    urlKey: PATIENT_ALERTS_TAB_URL_KEY,
    ariaLabel: t('emergencyFlags.tabs.ariaLabel'),
    options: PATIENT_ALERT_TABS,
    defaultValue: EMERGENCY_FLAG_OPEN_TAB,
  });

  const {
    filteredData: rawEmergencyFlags,
    isLoading,
    reactQueryData,
    tablePaginationProps,
  } = useServerSideListFilters<EmergencyFlagListItem>({
    listType: LIST_TYPES.emergencyFlags,
    queryToCall: useFetchEmergencyFlagsList,
    dataKey: LIST_TYPES.emergencyFlags.value,

    // No `flag` filter: the patient view lists critical and moderate alerts.
    baseParams: {
      patientId,
      ...tabParams,
      ...SUB_ROUTE_PARAMS,
    },

    // Own URL namespace so pagination doesn't collide with the sibling
    // Recent Checklist Reports table on the same page.
    urlKeyPrefix: LIST_INSTANCE_KEYS.patientRedFlags,
  });

  const emergencyFlags = rawEmergencyFlags.map(
    (emergencyFlag: RawEmergencyFlagResponse) =>
      transformRedFlagResponse({redFlag: emergencyFlag})
  );

  return (
    <EmergencyFlagsTableUI
      emergencyFlags={emergencyFlags}
      isLoading={isLoading || reactQueryData.isFetching}
      paginationProps={tablePaginationProps}
      title={title || t('patients.details.redFlagsTable.title')}
      hidePatientColumn
      alwaysShowCaregiverColumn
      hideActions
      noRowsLabel={
        noRowsLabel || t('patients.details.redFlagsTable.noRowsLabel')
      }
      titleInCard
      titleAction={<SegmentedTabs {...tabs} flat />}
    />
  );
};

export default PatientEmergencyFlagsTable;
