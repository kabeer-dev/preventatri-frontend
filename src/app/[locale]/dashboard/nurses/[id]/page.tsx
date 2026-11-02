import NurseDetails from '@/shared/components/pages/dashboard/nurseDetails';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

interface Props {
  params: Promise<{id: string}>;
}

export default async function NurseDetailPage({params}: Props) {
  const {id} = await params;

  return <NurseDetails nurseId={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'nurseDetail'});
