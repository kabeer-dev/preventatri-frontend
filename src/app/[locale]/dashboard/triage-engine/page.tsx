import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import TriageEnginePage from '@/views/pages/triageEngine';

const TriageEngine = () => {
  return <TriageEnginePage />;
};

export default TriageEngine;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'triage-engine'});
