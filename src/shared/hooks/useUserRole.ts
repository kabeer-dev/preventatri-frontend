import {SYSTEM_ROLES} from '@/shared/constants/common';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';

export default function useUserRole() {
  const {currentUser} = useGetLoggedInUser();
  const userRole = currentUser?.currentActiveOrganization?.role;

  return {
    userRole,
    isAdmin: userRole === SYSTEM_ROLES.admin.value,
    isEmployee: userRole === SYSTEM_ROLES.employee.value,
    isNurse: userRole === SYSTEM_ROLES.nurse.value,
    isCaregiver: userRole === SYSTEM_ROLES.caregiver.value,
    isCaseManager: userRole === SYSTEM_ROLES.caseManager.value,
    isSuperAdmin: userRole === SYSTEM_ROLES.superAdmin.value,
  };
}
