'use client';

import {useCallback} from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import Icon from '@/@core/components/icon';
import CurrentOrganizationBadge from '@/@core/layouts/components/shared-components/CurrentOrganizationBadge';
import {layout} from '@/@core/theme/spacing';
import {RoutePageHeading} from '@/shared/components/common/headers/PageHeading';
import NotificationDropdown from '@/shared/components/layout/notificationDropdown';
import {Settings} from '@/shared/providers/SettingsProvider';
import {useTopBar} from '@/shared/providers/TopBarProvider';

interface Props {
  hidden: boolean;
  settings: Settings;
  toggleNavVisibility: () => void;
  saveSettings: (values: Partial<Settings>) => void;

  /** True on screens that need the whole top bar for their own controls. */
  hideNotifications?: boolean;
}

const AppBarContent = (props: Props) => {
  const {hidden, settings, toggleNavVisibility, hideNotifications} = props;
  const {setContainer} = useTopBar();

  const leftRef = useCallback(
    (element: HTMLElement | null) => setContainer({side: 'left', element}),
    [setContainer]
  );

  const rightRef = useCallback(
    (element: HTMLElement | null) => setContainer({side: 'right', element}),
    [setContainer]
  );

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexWrap: {xs: 'wrap', sm: 'nowrap'},
        alignItems: 'center',
        columnGap: 2,
        rowGap: 3,
        py: {xs: 3, sm: 0},
        '& .MuiButton-root, & .MuiOutlinedInput-root': {
          height: layout.topBarActionSize,
          minHeight: layout.topBarActionSize,
        },
      }}
    >
      <Box
        className='actions-left'
        sx={{
          flex: '1 1 0',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          minWidth: 0,
        }}
      >
        {hidden && !settings.navHidden ? (
          <IconButton
            color='inherit'
            sx={{ml: -2.75}}
            onClick={toggleNavVisibility}
          >
            <Icon icon='mdi:menu' />
          </IconButton>
        ) : null}
        <RoutePageHeading />
        <Box ref={leftRef} sx={{display: 'contents'}} />
      </Box>

      {/* On phones the page actions drop to their own full-width row, so the
          heading and the notification bell keep the first row. */}
      <Box
        ref={rightRef}
        className='actions-right'
        sx={{
          order: {xs: 1, sm: 0},
          width: {xs: '100%', sm: 'auto'},
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 2,
          '&:empty': {display: 'none'},
        }}
      />
      <CurrentOrganizationBadge />
      {!hideNotifications && <NotificationDropdown />}
    </Box>
  );
};

export default AppBarContent;
