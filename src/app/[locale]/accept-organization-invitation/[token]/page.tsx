import AcceptOrganizationInvitation from '@/shared/components/pages/dashboard/acceptOrganizationInvitation';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

interface Props {
  params: Promise<{token: string}>;
}

export default async function AcceptOrganizationInvitationPage({
  params,
}: Props) {
  const {token} = await params;

  return <AcceptOrganizationInvitation key={token} token={token} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'acceptOrganizationInvitation'});
