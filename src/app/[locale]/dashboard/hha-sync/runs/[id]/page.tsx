import {HhaSyncRunPageProps} from '@/shared/interfaces/hhaSyncHistory';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import HhaSyncRunDetails from '@/views/pages/hhaSync/HhaSyncRunDetails';

export default async function HhaSyncRunPage({params}: HhaSyncRunPageProps) {
  const {id} = await params;

  return <HhaSyncRunDetails runId={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'hhaSyncRun'});
