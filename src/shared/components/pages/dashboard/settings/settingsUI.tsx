'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

import {SETTINGS_SECTION_KEYS} from '@/shared/constants/settings';
import useSettingsSection from '@/shared/hooks/useSettingsSection';

import ActiveDevicesCard from './activeDevicesCard';
import EscalationSettingsCard from './escalationSettingsCard';
import OrganizationSettingsCard from './organizationSettingsCard';
import PasswordUpdateForm from './passwordUpdateForm';
import PersonalDetailsForm from './personalDetailsForm';
import ProfileImage from './ProfileImage';
import SettingsNav from './SettingsNav';
import TwoStepVerificationCard from './twoStepVerificationCard';

const SettingsUI = () => {
  const {sections, section, setSection} = useSettingsSection();

  return (
    <Box
      className='grid items-start gap-4'
      sx={{gridTemplateColumns: {xs: '1fr', md: '200px minmax(0, 1fr)'}}}
    >
      <SettingsNav
        sections={sections}
        value={section}
        onChange={(value) => setSection(value)}
      />

      <Box className='flex min-w-0 flex-col gap-4'>
        {section === SETTINGS_SECTION_KEYS.escalation && (
          <Card>
            <CardContent>
              <EscalationSettingsCard />
            </CardContent>
          </Card>
        )}

        {section === SETTINGS_SECTION_KEYS.organization && (
          <OrganizationSettingsCard />
        )}

        {section === SETTINGS_SECTION_KEYS.security && (
          <>
            <Card>
              <CardContent className='flex flex-col'>
                <TwoStepVerificationCard />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <ActiveDevicesCard />
              </CardContent>
            </Card>
          </>
        )}

        {section === SETTINGS_SECTION_KEYS.profile && (
          <>
            <Card sx={{pt: 4}}>
              <CardContent>
                <Grid container spacing={3.5}>
                  <Grid size={{xs: 12, sm: 2}}>
                    <ProfileImage />
                  </Grid>
                  <Grid size={{xs: 12, sm: 10}}>
                    <PersonalDetailsForm />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <PasswordUpdateForm />
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SettingsUI;
