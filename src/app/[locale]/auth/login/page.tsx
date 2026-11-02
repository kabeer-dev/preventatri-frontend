import LoginForm from '@/shared/components/pages/auth/login';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export default function LoginPage() {
  return <LoginForm />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'login'});
