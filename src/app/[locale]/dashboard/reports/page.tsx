import {getMetadataDetails} from '@/shared/utils/metadataUtils';
import ReportsPage from '@/views/pages/reports';

const Reports = () => {
  return <ReportsPage />;
};

export default Reports;

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'reports'});
