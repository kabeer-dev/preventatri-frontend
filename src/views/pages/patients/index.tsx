'use client';

import {PATIENT_VIEW_VARIANT} from '@/shared/constants/patients';
import useUserRole from '@/shared/hooks/useUserRole';

import PatientsTable from './PatientsTable';

const PatientsPage = () => {
  const {isCaregiver, isNurse, isCaseManager} = useUserRole();

  const isReadOnly = isCaregiver || isNurse || isCaseManager;

  // The caregiver reads the same list the office reads, cut down to her
  // columns on a desktop and folded into rows on a phone.
  if (isCaregiver) {
    return (
      <PatientsTable isReadOnly variant={PATIENT_VIEW_VARIANT.caregiver} />
    );
  }

  return <PatientsTable isReadOnly={isReadOnly} />;
};

export default PatientsPage;
