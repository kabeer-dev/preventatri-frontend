import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import PatientsPage from '@/views/pages/patients';

const Patients = () => {
  return <PatientsPage />;
};

export default Patients;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'patients'});
