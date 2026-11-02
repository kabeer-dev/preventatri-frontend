import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import NotificationsPage from '@/views/pages/notifications';

const Notifications = () => {
  return <NotificationsPage />;
};

export default Notifications;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'notifications'});
