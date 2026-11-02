import {useMemo} from 'react';

import {DROPDOWN_SORT} from '@/shared/constants/general';
import {COUNTIES} from '@/shared/constants/reactQueryConstants';
import {useAsyncSelectOptions} from '@/shared/hooks/useAsyncSelectOptions';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {CountyOption, Patient} from '@/shared/interfaces/patient';
import {formatCountyLabel} from '@/shared/utils/countyUtils';

const toCountyOption = ({row}: {row: any}): CountyOption => ({
  value: row.id,
  label: formatCountyLabel({name: row.name, stateCode: row.stateCode}),
  regionName: row.region?.name || '',
  regionId: row.regionId || '',
});

const COUNTY_PARAMS = {regionIsActive: true, ...DROPDOWN_SORT.byName};

// Counties of active regions, searched and paged on the server. The saved
// county is seeded so its region resolves before its page is loaded.
const usePatientCountyOptions = ({
  enabled,
  patient,
}: {
  enabled: boolean;
  patient?: Patient | null;
}): AsyncSelectSource<CountyOption> => {
  const seedOptions = useMemo(
    () =>
      patient?.county
        ? [
            {
              value: patient.county,
              label: patient.countyName || '',
              regionName: patient.assignedRegion || '',
              regionId: patient.assignedRegionId || '',
            },
          ]
        : [],
    [patient]
  );

  return useAsyncSelectOptions({
    query: COUNTIES.fetchCountiesList,
    listKey: 'counties',
    toOption: toCountyOption,
    params: COUNTY_PARAMS,
    enabled,
    seedOptions,
  });
};

export default usePatientCountyOptions;
