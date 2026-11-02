import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import AssessmentsPage from '@/views/pages/assessments';

interface Props {
  params: Promise<{id: string}>;
}

export default async function PatientAssessments({params}: Props) {
  const {id} = await params;

  return <AssessmentsPage patientId={id} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'assessments'});
