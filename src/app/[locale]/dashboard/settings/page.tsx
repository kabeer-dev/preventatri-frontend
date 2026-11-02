import Settings from '@/shared/components/pages/dashboard/settings';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export default function page() {
  return <Settings />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'settings'});
