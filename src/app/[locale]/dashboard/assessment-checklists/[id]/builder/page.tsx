import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import ChecklistBuilder from '@/views/pages/assessmentChecklists/ChecklistBuilder';

interface Props {
  params: Promise<{id: string}>;
}

export default async function ChecklistBuilderPage({params}: Props) {
  const {id} = await params;

  return <ChecklistBuilder checklistId={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'assessmentChecklistBuilder'});
