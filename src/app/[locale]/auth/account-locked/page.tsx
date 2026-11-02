import {AccountLocked} from '@/shared/components/pages/auth/accountLocked';
import {getMetadataDetails} from '@/shared/utils/metadataUtils';

export default function AccountLockedPage() {
  return <AccountLocked />;
}

export const generateMetadata = async () =>
  await getMetadataDetails({pageName: 'accountLocked'});
