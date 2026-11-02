import AcceptInvitationHandler from '@/shared/components/pages/auth/acceptInvitation';
import {AcceptInvitationPageProps} from '@/shared/interfaces/auth';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export default async function AcceptInvitation({
  params,
}: AcceptInvitationPageProps) {
  const {token} = await params;

  return <AcceptInvitationHandler key={token} token={token} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'acceptInvitation'});
