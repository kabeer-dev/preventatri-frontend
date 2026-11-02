import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import RegionsPage from '@/views/pages/regions';

const Regions = () => {
  return <RegionsPage />;
};

export default Regions;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'region'});
