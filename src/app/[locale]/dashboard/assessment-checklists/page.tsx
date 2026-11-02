import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import AssessmentChecklistsPage from '@/views/pages/assessmentChecklists';

const AssessmentChecklists = () => {
  return <AssessmentChecklistsPage />;
};

export default AssessmentChecklists;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'assessmentChecklists'});
