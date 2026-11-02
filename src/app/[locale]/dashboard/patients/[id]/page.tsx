import PatientDetails from '@/shared/components/pages/dashboard/patientDetails';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

interface Props {
  params: Promise<{id: string}>;
}

export default async function PatientDetailPage({params}: Props) {
  const {id} = await params;

  return <PatientDetails patientId={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'patientDetail'});
