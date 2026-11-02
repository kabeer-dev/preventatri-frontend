import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import ChecklistPage from '@/views/pages/checklist';

interface Props {
  params: Promise<{id: string}>;
}

export default async function PatientChecklist({params}: Props) {
  const {id} = await params;

  return <ChecklistPage patientId={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'checklist'});
