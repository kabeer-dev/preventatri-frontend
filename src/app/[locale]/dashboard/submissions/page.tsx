import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import SubmissionsPage from '@/views/pages/submissions';

const Submissions = () => {
  return <SubmissionsPage />;
};

export default Submissions;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'submissions'});
