import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import SupervisoryVisitDetails from '@/views/pages/supervisoryVisits/SupervisoryVisitDetails';

interface Props {
  params: Promise<{id: string}>;
}

export default async function SupervisoryVisitDetailPage({params}: Props) {
  const {id} = await params;

  return <SupervisoryVisitDetails id={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'supervisoryVisits'});
