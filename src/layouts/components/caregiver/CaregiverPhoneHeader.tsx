'use client';

import Box from '@mui/material/Box';

import AppBarContent from '@/layouts/components/vertical/AppBarContent';
import {useSettings} from '@/shared/providers/SettingsProvider';

const noop = () => {};

const CaregiverPhoneHeader = () => {
  const {settings, saveSettings} = useSettings();

  return (
    <Box sx={{mb: {xs: 1, sm: 4}}}>
      <AppBarContent
        hideNotifications
        hidden={false}
        settings={settings}
        saveSettings={saveSettings}
        toggleNavVisibility={noop}
      />
    </Box>
  );
};

export default CaregiverPhoneHeader;
