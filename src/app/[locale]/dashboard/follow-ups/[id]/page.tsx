import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import FollowUpDetails from '@/views/pages/followUps/FollowUpDetails';

interface Props {
  params: Promise<{id: string}>;
}

export default async function FollowUpDetailPage({params}: Props) {
  const {id} = await params;

  return <FollowUpDetails id={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'followUps'});
