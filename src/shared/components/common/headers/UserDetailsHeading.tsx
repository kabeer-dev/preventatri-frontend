'use client';

import RecordHeading from '@/shared/components/common/headers/RecordHeading';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {UserDetailsHeadingProps} from '@/shared/interfaces/layout';

const UserDetailsHeading = ({
  name,
  avatar,
  avatarColor,
}: UserDetailsHeadingProps) => {
  const {t} = useTranslation();

  return (
    <TopBarSlot side='left'>
      <RecordHeading
        crumb={t('orgUsers.backToList')}
        crumbHref={DASHBOARD_ROUTES.users.all()}
        name={name}
        avatar={avatar}
        avatarColor={avatarColor}
      />
    </TopBarSlot>
  );
};

export default UserDetailsHeading;
