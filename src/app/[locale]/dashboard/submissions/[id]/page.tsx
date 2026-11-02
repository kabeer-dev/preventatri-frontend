import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import SubmissionDetails from '@/views/pages/submissions/SubmissionDetails';

interface Props {
  params: Promise<{id: string}>;
}

export default async function SubmissionDetailPage({params}: Props) {
  const {id} = await params;

  return <SubmissionDetails submissionId={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'submissionDetail'});
