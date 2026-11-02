import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import FollowUpsPage from '@/views/pages/followUps';

const FollowUps = () => {
  return <FollowUpsPage />;
};

export default FollowUps;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'followUps'});
