import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import ActivityLogPage from '@/views/pages/activityLog';

const ActivityLog = () => {
  return <ActivityLogPage />;
};

export default ActivityLog;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'activityLog'});
