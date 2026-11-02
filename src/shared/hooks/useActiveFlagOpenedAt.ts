import {UseActiveFlagOpenedAtParams} from '@/shared/interfaces/flag';
import {useQueries as useFlagQueries} from '@/shared/reactQuery/flags/queries';
import {getFlagReportedAt} from '@/shared/utils/alertReview';

// The active-flag payload carries no raise time, so it is read from the case
// details the "Open case details" modal fetches anyway. Same query key, so
// that modal then opens from cache. The fetch is silent: it only feeds an
// optional pill, and a failure still surfaces once the modal is opened.
const useActiveFlagOpenedAt = ({id}: UseActiveFlagOpenedAtParams) => {
  const {useFetchFlagCaseDetails} = useFlagQueries();

  const {data} = useFetchFlagCaseDetails({
    id,
    toastConfig: {error: {show: false}},
  });

  return getFlagReportedAt({caseDetails: data?.flagDetails});
};

export default useActiveFlagOpenedAt;
