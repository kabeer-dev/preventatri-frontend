import {HandleUnverifiedLogin} from '@/shared/components/pages/auth/unverifiedLogin';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export default function UnVerifiedLoginAttemptPage() {
  return <HandleUnverifiedLogin />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'unverifiedLogin'});
