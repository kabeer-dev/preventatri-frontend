import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import HhaSyncPage from '@/views/pages/hhaSync';

const HhaSync = () => {
  return <HhaSyncPage />;
};

export default HhaSync;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'hhaSync'});
