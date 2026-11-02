'use client';

import {ReactNode} from 'react';

import {Theme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import {VerticalNavItemsType} from '@/@core/layouts/types';
import VerticalLayout from '@/@core/layouts/VerticalLayout';
import {useSettings} from '@/shared/providers/SettingsProvider';

import AppBarContent from './components/vertical/AppBarContent';

interface Props {
  children: ReactNode;
  navItems: VerticalNavItemsType;

  /** Rendered below the nav list and above the profile block. */
  afterNavContent?: (props: object) => ReactNode;

  /** Extra styles for the nav list, e.g. a different top gap. */
  navListSx?: object;

  /** True on screens that need the whole top bar for their own controls. */
  hideNotifications?: boolean;
}

const SidebarLayout = ({
  children,
  navItems,
  afterNavContent,
  navListSx,
  hideNotifications = false,
}: Props) => {
  const {settings, saveSettings} = useSettings();

  // Check if below lg breakpoint
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalLayoutProps={{
        navMenu: {
          navItems,
          afterContent: afterNavContent,
          listSx: navListSx,
        },
        appBar: {
          content: (props) => (
            <AppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              hideNotifications={hideNotifications}
              toggleNavVisibility={
                (props as {toggleNavVisibility: () => void}).toggleNavVisibility
              }
            />
          ),
        },
      }}
    >
      {children}
    </VerticalLayout>
  );
};

export default SidebarLayout;
