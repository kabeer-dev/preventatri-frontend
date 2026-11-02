import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import SupervisoryVisitChecklistRunner from '@/views/pages/supervisoryVisits/SupervisoryVisitChecklistRunner';

interface Props {
  params: Promise<{id: string}>;
}

export default async function SupervisoryVisitChecklistPage({params}: Props) {
  const {id} = await params;

  return <SupervisoryVisitChecklistRunner id={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'supervisoryVisits'});
