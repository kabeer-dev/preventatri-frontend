'use client';

import {EMERGENCY_FLAG_FILTERS} from '@/shared/constants/flag';
import {LIST_TYPES} from '@/shared/constants/general';
import {
  LIST_INSTANCE_KEYS,
  SUB_ROUTE_PARAMS,
} from '@/shared/constants/reactQueryConstants';
import useServerSideListFilters from '@/shared/hooks/listFilters/useServerSideListFilters';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  EmergencyFlagListItem,
  RawEmergencyFlagResponse,
} from '@/shared/interfaces/emergencyFlag';
import {assessmentQueries} from '@/shared/reactQuery';
import {transformRedFlagResponse} from '@/shared/utils/redFlagUtils';
import EmergencyFlagsTableUI from '@/views/pages/emergencyFlags/EmergencyFlagsTable/EmergencyFlagsTableUI';

interface CaregiverEmergencyFlagsTableProps {
  caregiverId: string;
}

const CaregiverEmergencyFlagsTable = ({
  caregiverId,
}: CaregiverEmergencyFlagsTableProps) => {
  const {t} = useTranslation();
  const {useFetchEmergencyFlagsList} = assessmentQueries();

  const {
    filteredData: rawEmergencyFlags,
    isLoading,
    reactQueryData,
    tablePaginationProps,
  } = useServerSideListFilters<EmergencyFlagListItem>({
    listType: LIST_TYPES.emergencyFlags,
    queryToCall: useFetchEmergencyFlagsList,
    dataKey: LIST_TYPES.emergencyFlags.value,

    // Embedded caregiver view stays RED-only (preserves its prior behaviour).
    baseParams: {
      caregiverId,
      flag: EMERGENCY_FLAG_FILTERS.RED,
      ...SUB_ROUTE_PARAMS,
    },

    // Own URL namespace so pagination doesn't collide with the sibling
    // submissions and patients tables on the same page.
    urlKeyPrefix: LIST_INSTANCE_KEYS.caregiverRedFlags,
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
      title={t('caregiver.details.redFlagsTable.title')}
      titleInCard
      hideCaregiverColumn
      hideActions
      noRowsLabel={t('caregiver.details.redFlagsTable.noRowsLabel')}
    />
  );
};

export default CaregiverEmergencyFlagsTable;
