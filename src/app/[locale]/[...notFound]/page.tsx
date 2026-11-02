import NotFoundContent from '@/shared/components/pages/notFound';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export default function NotFound() {
  return <NotFoundContent />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'not-found'});
