import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import CaregiverRedFlagView from '@/views/pages/caregiverRedFlag';

const CaregiverRedFlag = () => {
  return <CaregiverRedFlagView />;
};

export default CaregiverRedFlag;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'caregiverRedFlag'});
