import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import HhaVisitsPage from '@/views/pages/hhaVisits';

const HhaVisits = () => {
  return <HhaVisitsPage />;
};

export default HhaVisits;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'hhaVisits'});
