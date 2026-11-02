import OtpPage from '@/shared/components/pages/auth/otpVerification';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export default function OtpVerificationPage() {
  return <OtpPage />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'otpVerification'});
