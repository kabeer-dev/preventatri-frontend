'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {usePathname} from 'next/navigation';

import {PAGE_HEADINGS} from '@/shared/constants/pageHeadings';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useOrgName from '@/shared/hooks/useOrgName';
import useSettingsSection from '@/shared/hooks/useSettingsSection';
import useUserRole from '@/shared/hooks/useUserRole';
import {PageHeadingProps} from '@/shared/interfaces/layout';
import {matchesRoute} from '@/shared/utils/routeUtils';

const PageHeading = ({crumb, title}: PageHeadingProps) => {
  const orgName = useOrgName();

  // Without an organisation name a crumb that repeats the title says nothing,
  // so the heading drops the line and names the page once.
  const hasCrumbLine = Boolean(orgName) || crumb !== title;

  return (
    <Box sx={{minWidth: 0}}>
      {crumb && hasCrumbLine && (
        <Typography
          noWrap
          sx={{fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.5}}
        >
          {orgName && `${orgName} / `}
          <Box component='span' sx={{color: 'text.primary', fontWeight: 600}}>
            {crumb}
          </Box>
        </Typography>
      )}

      <Typography
        noWrap
        component='h1'
        sx={{fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.4}}
      >
        {title}
      </Typography>
    </Box>
  );
};

// Settings is one route with a side menu, so the heading names the selected
// section under a "Settings" crumb instead of repeating the page name.
const SettingsPageHeading = ({crumb, title}: PageHeadingProps) => {
  const {sectionLabel} = useSettingsSection();

  return <PageHeading crumb={crumb} title={sectionLabel || title} />;
};

export const RoutePageHeading = () => {
  const pathname = usePathname();
  const {userRole} = useUserRole();

  const match = Object.entries(PAGE_HEADINGS).find(([route]) =>
    matchesRoute({pathname, route})
  );

  if (!match) return null;

  const [route, {hiddenForRoles, ...heading}] = match;

  // Some screens write their own heading into the top bar (the caregiver's
  // Today and checklist runner), so the route heading steps aside for them.
  if (userRole && hiddenForRoles?.includes(userRole)) return null;

  if (route === DASHBOARD_ROUTES.settings.all()) {
    return <SettingsPageHeading {...heading} />;
  }

  return <PageHeading {...heading} />;
};

export default PageHeading;
