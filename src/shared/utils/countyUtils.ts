import {
  COUNTY_FIPS_PATTERN,
  COUNTY_LABEL_SEPARATOR,
} from '@/shared/constants/counties';
import {
  CountyLabelParts,
  RegionCountyRef,
  RegionCountySource,
} from '@/shared/interfaces/region';

// "Washington, PA"; a county saved before states existed is just its name.
export const formatCountyLabel = ({name, stateCode}: CountyLabelParts) =>
  stateCode ? [name, stateCode].join(COUNTY_LABEL_SEPARATOR) : name;

// A county with no FIPS code can only be referred to by its own id.
export const getCountyOptionValue = ({county}: {county: RegionCountySource}) =>
  county.fipsCode || county.id;

export const toRegionCountyRef = ({value}: {value: string}): RegionCountyRef =>
  COUNTY_FIPS_PATTERN.test(value) ? {fipsCode: value} : {id: value};
