import {userQueries} from '@/shared/reactQuery';

export default function useGetLoggedInUser({
  enabled = true,
}: {enabled?: boolean} = {}) {
  const {useFetchLoginUserInfo} = userQueries();

  const query = useFetchLoginUserInfo({enabled});

  const {user: currentUser} = query.data || {};

  const isLoggedIn = Boolean(currentUser?.id);

  return {...query, currentUser, isLoggedIn};
}
