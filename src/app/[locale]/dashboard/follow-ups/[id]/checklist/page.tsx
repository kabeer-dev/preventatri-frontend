import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import FollowUpChecklistRunner from '@/views/pages/followUps/FollowUpChecklistRunner';

interface Props {
  params: Promise<{id: string}>;
}

export default async function FollowUpChecklistPage({params}: Props) {
  const {id} = await params;

  return <FollowUpChecklistRunner id={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'followUps'});
