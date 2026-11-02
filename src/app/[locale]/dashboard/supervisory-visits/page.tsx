import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import SupervisoryVisitsPage from '@/views/pages/supervisoryVisits';

const SupervisoryVisits = () => {
  return <SupervisoryVisitsPage />;
};

export default SupervisoryVisits;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'supervisoryVisits'});
