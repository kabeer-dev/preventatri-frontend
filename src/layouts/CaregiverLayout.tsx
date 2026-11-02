'use client';

import Box from '@mui/material/Box';
import {usePathname} from 'next/navigation';

import {layout} from '@/@core/theme/spacing';
import CaregiverBottomTabs from '@/layouts/components/caregiver/CaregiverBottomTabs';
import CaregiverPhoneHeader from '@/layouts/components/caregiver/CaregiverPhoneHeader';
import SidebarLayout from '@/layouts/SidebarLayout';
import caregiverNavigation from '@/navigation/vertical/caregiver';
import {
  CAREGIVER_LAYOUT,
  CAREGIVER_PHONE_OWN_HEADER_ROUTES,
} from '@/shared/constants/caregiver';
import {DASHBOARD_ROUTES, ROUTE_ID} from '@/shared/constants/paths';
import useCaregiverChecklists from '@/shared/hooks/useCaregiverChecklists';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useTranslation from '@/shared/hooks/useTranslation';
import {NodeChildrenProps} from '@/shared/interfaces/common';
import CaregiverRedFlagProvider, {
  useCaregiverRedFlag,
} from '@/shared/providers/CaregiverRedFlagProvider';
import {
  isCaregiverFullScreenPath,
  matchesRoute,
} from '@/shared/utils/routeUtils';

/**
 * The dark sidebar shell. It reads the red flag provider, so it has to sit
 * inside it rather than beside it.
 */
const CaregiverDesktopShell = ({children}: NodeChildrenProps) => {
  const {t} = useTranslation();
  const pathname = usePathname();
  const {openRedFlag, currentPatient} = useCaregiverRedFlag();

  const {late} = useCaregiverChecklists();

  const navItems = caregiverNavigation({
    lateCount: late.length,
    lateLabel: t('caregiverPortal.nav.lateBadge', {count: late.length}),
    todayLabel: t('caregiverPortal.nav.today'),
    patientsLabel: t('caregiverPortal.nav.patients'),
    activityLabel: t('caregiverPortal.nav.activity'),
    notificationsLabel: t('caregiverPortal.nav.notifications'),
    redFlagLabel: t('caregiverPortal.nav.raiseRedFlag'),
    onRaiseRedFlag: () => openRedFlag({patientId: currentPatient?.id}),
  });

  // The checklist runner and its summary own the whole top bar, so the bell
  // would sit on top of the progress read-out.
  const isRunningChecklist = matchesRoute({
    pathname,
    route: DASHBOARD_ROUTES.checklist(ROUTE_ID),
  });

  return (
    <SidebarLayout
      navItems={navItems}
      hideNotifications={isRunningChecklist}

      // The caregiver's list has no section title, so it needs that row's
      // height back to start where every other role's first item starts.
      navListSx={{
        pt: `${layout.navSectionTitleHeight}px`,
        '& > :first-of-type': {mt: 0.75},
      }}
    >
      {children}
    </SidebarLayout>
  );
};

/**
 * The caregiver shell, split at MUI `lg` (1200px) and nowhere else.
 *
 * Desktop keeps the dark sidebar every other role sees. Below `lg` the drawer
 * and its hamburger are gone: navigation moves to four fixed bottom tabs, and
 * the content is padded so they never cover it.
 *
 * Filling a checklist and raising a red flag are the screens that own the
 * bottom edge: the tabs are hidden there so the pinned action sits on it. They
 * draw their own header too, as do Today with its dark greeting and Me with
 * her name, so the phone heading is left out on all of them.
 */
const CaregiverLayout = ({children}: NodeChildrenProps) => {
  const pathname = usePathname();

  const isDesktop = useIsDesktop();

  const isFullScreen = isCaregiverFullScreenPath({path: pathname});

  const hasOwnHeader = CAREGIVER_PHONE_OWN_HEADER_ROUTES.some((route) =>
    matchesRoute({pathname, route})
  );

  const hasHeader = !isFullScreen && !hasOwnHeader;

  if (isDesktop) {
    return (
      <CaregiverRedFlagProvider>
        <CaregiverDesktopShell>{children}</CaregiverDesktopShell>
      </CaregiverRedFlagProvider>
    );
  }

  return (
    <CaregiverRedFlagProvider>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
        }}
      >
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            px: `${layout.phoneGutter}px`,
            pt: `${layout.pageGutterY}px`,
            pb: isFullScreen ? 5 : `${CAREGIVER_LAYOUT.tabBarHeight + 24}px`,
          }}
        >
          {hasHeader && <CaregiverPhoneHeader />}

          {children}
        </Box>

        {!isFullScreen && <CaregiverBottomTabs />}
      </Box>
    </CaregiverRedFlagProvider>
  );
};

export default CaregiverLayout;
