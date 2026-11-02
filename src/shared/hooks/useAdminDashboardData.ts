import {
  AdminDashboardActionStatKey,
  UseAdminDashboardDataParams,
  UseAdminDashboardDataResult,
} from '@/shared/interfaces/dashboard';
import {useQueries} from '@/shared/reactQuery/dashboard/queries';

// `enabled` gates every request so non-admin roles never hit the admin APIs.
const useAdminDashboardData = ({
  enabled = true,
}: UseAdminDashboardDataParams = {}): UseAdminDashboardDataResult => {
  const {useFetchAdminDashboardStats} = useQueries();

  const {
    data: statsResponse,
    dataUpdatedAt: statsUpdatedAt,
    isLoading,
  } = useFetchAdminDashboardStats({enabled});

  const actionValues: Partial<
    Record<AdminDashboardActionStatKey, number | null>
  > = statsResponse?.stats || {};

  return {statsUpdatedAt, actionValues, isLoading};
};

export default useAdminDashboardData;
