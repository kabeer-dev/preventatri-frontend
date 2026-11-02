'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import PatientSearch from '@/shared/components/layout/patientSearch';
import TopBarSearch from '@/shared/components/layout/topBarSearch';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import CaregiverTodayView from '@/views/pages/caregiverToday';
import AdminDashboardView from '@/views/pages/dashboard/AdminDashboardView';
import CaseManagerDashboardView from '@/views/pages/dashboard/CaseManagerDashboardView';
import NurseDashboardView from '@/views/pages/dashboard/NurseDashboardView';

export default function DashboardContent() {
  const {t} = useTranslation();
  const {isAdmin, isNurse, isCaregiver, isCaseManager} = useUserRole();

  let roleView = null;
  if (isAdmin) roleView = <AdminDashboardView />;
  else if (isNurse) roleView = <NurseDashboardView />;
  else if (isCaregiver) roleView = <CaregiverTodayView />;
  else if (isCaseManager) roleView = <CaseManagerDashboardView />;

  if (!roleView)
    return (
      <Box className='flex h-full items-center justify-center'>
        <Typography variant='h2' className='text-center'>
          {t('dashboard.message')}
        </Typography>
      </Box>
    );

  return (
    <>
      {isAdmin && (
        <TopBarSlot side='right'>
          <TopBarSearch />
        </TopBarSlot>
      )}
      {(isNurse || isCaseManager) && (
        <TopBarSlot side='right'>
          <PatientSearch />
        </TopBarSlot>
      )}
      {roleView}
    </>
  );
}
