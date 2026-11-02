import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import EmergencyFlagDetails from '@/views/pages/emergencyFlags/EmergencyFlagDetails';

interface Props {
  params: Promise<{id: string}>;
}

export default async function EmergencyFlagDetailPage({params}: Props) {
  const {id} = await params;

  return <EmergencyFlagDetails emergencyFlagId={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'emergencyFlagDetail'});
