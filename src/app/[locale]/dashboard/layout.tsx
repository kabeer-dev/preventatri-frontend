'use client';

import {useMemo} from 'react';

import {NavGroup, NavLink, NavSectionTitle} from '@/@core/layouts/types';
import CaregiverLayout from '@/layouts/CaregiverLayout';
import SidebarLayout from '@/layouts/SidebarLayout';
import navigation from '@/navigation/vertical';
import ActiveFlagModal from '@/shared/components/common/modals/ActiveFlagModal';
import FlagCaseDetailsModal from '@/shared/components/common/modals/FlagCaseDetailsModal';
import {SYSTEM_ROLES} from '@/shared/constants/common';
import {useModal} from '@/shared/hooks/modals/useModal';
import useHhaEnabled from '@/shared/hooks/useHhaEnabled';
import useUserRole from '@/shared/hooks/useUserRole';
import {NodeChildrenProps} from '@/shared/interfaces/common';
import TopBarProvider from '@/shared/providers/TopBarProvider';
import {useQueries as useFlagQueries} from '@/shared/reactQuery/flags/queries';
import {secondsUntilIso} from '@/shared/utils/dateUtils';

type FilterableNavItem = NavLink | NavGroup | NavSectionTitle;

const filterNavItemsByRole = <T extends FilterableNavItem>({
  items,
  userRole,
  isHhaEnabled,
}: {
  items: T[];
  userRole: string;
  isHhaEnabled: boolean;
}): T[] => {
  const filtered = items.reduce<T[]>((acc, item) => {
    if ('sectionTitle' in item) {
      acc.push(item);

      return acc;
    }

    if ('children' in item) {
      const children = filterNavItemsByRole({
        items: item.children,
        userRole,
        isHhaEnabled,
      });

      if (children.length === 0) return acc;

      if (children.length === 1) {
        acc.push(children[0] as T);

        return acc;
      }

      acc.push({...item, children} as T);

      return acc;
    }

    // An item with no roles is open to every role except the super admin, who
    // sees only the platform items.
    const isAllowedForRole = item.roles
      ? item.roles.includes(userRole)
      : userRole !== SYSTEM_ROLES.superAdmin.value;

    // An admin sees the HHAeXchange items before the organization is
    // connected: opening one asks them to connect.
    const canSeeHha =
      !item.requiresHha ||
      isHhaEnabled ||
      userRole === SYSTEM_ROLES.admin.value;

    const isVisible = isAllowedForRole && canSeeHha;

    if (isVisible) acc.push(item);

    return acc;
  }, []);

  // Drop any section title whose sibling items were all filtered out.
  return filtered.filter((item, index) => {
    if (!('sectionTitle' in item)) return true;

    const nextItem = filtered[index + 1];

    return nextItem && !('sectionTitle' in nextItem);
  });
};

const DashboardLayout = ({children}: NodeChildrenProps) => {
  const {userRole, isCaregiver, isAdmin, isSuperAdmin} = useUserRole();
  const isHhaEnabled = useHhaEnabled();

  const filteredNavItems = useMemo(() => {
    if (!userRole) return navigation();

    return filterNavItemsByRole({items: navigation(), userRole, isHhaEnabled});
  }, [userRole, isHhaEnabled]);

  const {
    isModalOpen: isCaseDetailsOpen,
    openModal: openCaseDetailsModal,
    closeModal: closeCaseDetailsModal,
  } = useModal();

  const {useFetchActiveFlags} = useFlagQueries();

  const {data: activeFlagsData, refetch: refetchActiveFlags} =
    useFetchActiveFlags({
      enabled: !isCaregiver && !isSuperAdmin,
    });

  const activeFlag = activeFlagsData?.flag;

  // Flags without expiresAt never expire. Flags with a past expiresAt are
  // skipped for non-admins — admins must still see them to act on the case.
  const isFlagExpired =
    activeFlag?.expiresAt != null &&
    secondsUntilIso({iso: activeFlag.expiresAt}) <= 0;

  const showFlagModal = activeFlag && (isAdmin || !isFlagExpired);

  return (
    <>
      <TopBarProvider>
        {isCaregiver ? (
          <CaregiverLayout>{children}</CaregiverLayout>
        ) : (
          <SidebarLayout navItems={filteredNavItems}>{children}</SidebarLayout>
        )}
      </TopBarProvider>
      {showFlagModal && (
        <>
          <ActiveFlagModal
            key={activeFlag.id}
            flag={activeFlag}
            onOpenCaseDetails={openCaseDetailsModal}
            onExpire={refetchActiveFlags}
          />
          <FlagCaseDetailsModal
            flag={activeFlag}
            isOpen={isCaseDetailsOpen}
            onClose={closeCaseDetailsModal}
            onResolve={closeCaseDetailsModal}
          />
        </>
      )}
    </>
  );
};

export default DashboardLayout;
