import UserVerificationHandler from '@/shared/components/pages/auth/verify';
import {VerifyPageProps} from '@/shared/interfaces/auth';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export default async function VerifyPage({params}: VerifyPageProps) {
  const {token} = await params;

  return <UserVerificationHandler token={token} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'verify'});
