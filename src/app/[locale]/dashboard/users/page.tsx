import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import UsersPage from '@/views/pages/users';

const Users = () => {
  return <UsersPage />;
};

export default Users;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'users'});
