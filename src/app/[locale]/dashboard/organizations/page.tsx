import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import OrganizationsPage from '@/views/pages/organizations';

const Organizations = () => {
  return <OrganizationsPage />;
};

export default Organizations;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'organizations'});
