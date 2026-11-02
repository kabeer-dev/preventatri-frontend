import SwitchOrganization from '@/shared/components/pages/dashboard/switchOrganization';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

interface Props {
  params: Promise<{organizationId: string}>;
}

export default async function SwitchOrganizationPage({params}: Props) {
  const {organizationId} = await params;

  return (
    <SwitchOrganization key={organizationId} organizationId={organizationId} />
  );
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'switchOrganization'});
