import ActionMessage from '@/shared/components/pages/auth/linkSent';
import {LinkSentPageProps} from '@/shared/interfaces/auth';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export default async function LinkSentPage({params}: LinkSentPageProps) {
  const {action} = await params;

  return <ActionMessage action={action} />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'linkSent'});
