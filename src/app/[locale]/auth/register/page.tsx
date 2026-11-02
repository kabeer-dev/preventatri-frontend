import RegisterForm from '@/shared/components/pages/auth/register';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export default function Register() {
  return <RegisterForm />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'register'});
