import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import ChecklistRoute from '@/views/pages/caregiverChecklist';

interface Props {
  params: Promise<{submissionId: string}>;
}

export default async function ChecklistBySubmission({params}: Props) {
  const {submissionId} = await params;

  return <ChecklistRoute submissionId={submissionId} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'checklist'});
