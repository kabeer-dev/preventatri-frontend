import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import CaregiverMeView from '@/views/pages/caregiverMe';

const CaregiverMe = () => {
  return <CaregiverMeView />;
};

export default CaregiverMe;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'caregiverMe'});
