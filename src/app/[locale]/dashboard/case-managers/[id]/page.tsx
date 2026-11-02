import CaseManagerDetails from '@/shared/components/pages/dashboard/caseManagerDetails';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

interface Props {
  params: Promise<{id: string}>;
}

export default async function CaseManagerDetailPage({params}: Props) {
  const {id} = await params;

  return <CaseManagerDetails caseManagerId={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'caseManagerDetail'});
