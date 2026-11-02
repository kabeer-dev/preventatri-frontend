import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import RedFlagPage from '@/views/pages/redFlag';

interface Props {
  params: Promise<{id: string}>;
}

export default async function PatientRedFlag({params}: Props) {
  const {id} = await params;

  return <RedFlagPage patientId={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'redFlag'});
