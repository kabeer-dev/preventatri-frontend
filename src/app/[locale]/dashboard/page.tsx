import DashboardContent from '@/shared/components/pages/dashboard';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export default function Dashboard() {
  return <DashboardContent />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'dashboard'});
