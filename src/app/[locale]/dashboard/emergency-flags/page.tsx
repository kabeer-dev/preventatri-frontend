import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import EmergencyFlagsPage from '@/views/pages/emergencyFlags';

const EmergencyFlags = () => {
  return <EmergencyFlagsPage />;
};

export default EmergencyFlags;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'emergencyFlags'});
