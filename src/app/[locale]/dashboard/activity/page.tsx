import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import CaregiverActivityView from '@/views/pages/caregiverActivity';

const CaregiverActivity = () => {
  return <CaregiverActivityView />;
};

export default CaregiverActivity;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'caregiverActivity'});
