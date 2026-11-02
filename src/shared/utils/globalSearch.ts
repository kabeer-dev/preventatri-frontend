import {ThemeColor} from '@/@core/theme/types';
import {
  PATIENT_SEARCH_RESULT_COLOR,
  SEARCH_RESULT_TYPES,
  SEARCH_SUBTITLE_SEPARATOR,
} from '@/shared/constants/globalSearch';
import {ORG_USER_ROLES} from '@/shared/constants/orgUsers';
import {MapSearchRowParams, SearchResult} from '@/shared/interfaces/search';
import {SearchResultType} from '@/shared/types/search';
import {getFullName} from '@/shared/utils/general';

const joinSubtitle = ({parts}: {parts: (string | null | undefined)[]}) =>
  parts.filter(Boolean).join(SEARCH_SUBTITLE_SEPARATOR);

const getStaffRole = ({type}: {type: string}) =>
  ORG_USER_ROLES[type as keyof typeof ORG_USER_ROLES];

export const getSearchResultColor = ({
  type,
}: {
  type: SearchResultType;
}): ThemeColor =>
  type === SEARCH_RESULT_TYPES.patient
    ? PATIENT_SEARCH_RESULT_COLOR
    : getStaffRole({type}).color;

// Null for a type with no badge or detail page, e.g. a role added to the API before the client knows it.
export const mapSearchRowToResult = ({
  row,
  t,
}: MapSearchRowParams): SearchResult | null => {
  const isPatient = row.type === SEARCH_RESULT_TYPES.patient;
  const staffRole = getStaffRole({type: row.type});

  if (!isPatient && !staffRole) return null;

  const label = isPatient ? t('shell.searchPatientLabel') : staffRole.label;

  return {
    id: row.id,
    type: row.type,
    name: getFullName(row),
    subtitle: joinSubtitle({parts: [label, row.email ?? row.location]}),
  };
};
