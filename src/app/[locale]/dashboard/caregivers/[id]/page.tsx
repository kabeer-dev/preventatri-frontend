import CaregiverDetails from '@/shared/components/pages/dashboard/caregiverDetails';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

interface Props {
  params: Promise<{id: string}>;
}

export default async function CaregiverDetailPage({params}: Props) {
  const {id} = await params;

  return <CaregiverDetails caregiverId={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'caregiverDetail'});
