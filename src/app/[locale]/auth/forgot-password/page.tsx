import ForgotPasswordForm from '@/shared/components/pages/auth/forgotPassword';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'forgotPassword'});
