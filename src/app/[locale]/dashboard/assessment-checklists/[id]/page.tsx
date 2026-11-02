import AssessmentChecklistDetails from '@/shared/components/pages/dashboard/assessmentChecklistDetails';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

interface Props {
  params: Promise<{id: string}>;
}

export default async function AssessmentChecklistDetailPage({params}: Props) {
  const {id} = await params;

  return <AssessmentChecklistDetails checklistId={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'assessmentChecklistDetail'});
