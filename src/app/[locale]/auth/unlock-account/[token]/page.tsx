import {UnlockAccountHandler} from '@/shared/components/pages/auth/unlockAccount';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export default async function UnlockAccountPage({
  params,
}: {
  params: Promise<{token: string}>;
}) {
  const {token} = await params;

  return <UnlockAccountHandler token={token} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'unlockAccount'});
