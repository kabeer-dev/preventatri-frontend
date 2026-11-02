import {ComponentType, ReactNode, SVGProps} from 'react';

import {PopoverOrigin} from '@mui/material/Popover';

import {ThemeColor} from '@/@core/theme/types';
import {Settings} from '@/shared/providers/SettingsProvider';

export type {ThemeColor};

export type NavIcon = string | ComponentType<SVGProps<SVGSVGElement>>;

export interface NavItemIconProps {
  icon?: NavIcon;
}

export interface NavLink {
  path?: string;
  title: string;
  icon?: NavIcon;
  disabled?: boolean;
  badgeContent?: string;
  badgeColor?: ThemeColor;
  externalLink?: boolean;
  openInNewTab?: boolean;
  roles?: string[];
  activePaths?: string[];

  /** Shown only while the organization is the one HHAeXchange is connected to. */
  requiresHha?: boolean;

  /** For the rare nav item that runs an action instead of changing route. */
  onClick?: () => void;

  /** Draws the item in the shell's danger colour. */
  isDanger?: boolean;
}

export interface NavGroup {
  title: string;
  icon?: NavIcon;
  badgeContent?: string;
  badgeColor?: ThemeColor;
  children: (NavLink | NavGroup)[];
}

export interface NavSectionTitle {
  sectionTitle: string;
}

export type VerticalNavItemsType = (NavLink | NavGroup | NavSectionTitle)[];

export interface LayoutProps {
  hidden: boolean;
  children: ReactNode;
  settings: Settings;
  saveSettings: (values: Partial<Settings>) => void;
  verticalNavItems?: VerticalNavItemsType;
  scrollToTop?: (props: LayoutProps) => ReactNode;
  footerProps?: {
    sx?: object;
    content?: (props: LayoutProps) => ReactNode;
  };
  verticalLayoutProps?: {
    navMenu?: {
      navItems?: VerticalNavItemsType;
      content?: (props: object) => ReactNode;
      branding?: (props: object) => ReactNode;
      lockedIcon?: ReactNode;
      unlockedIcon?: ReactNode;
      afterContent?: (props: object) => ReactNode;
      beforeContent?: (props: object) => ReactNode;
      componentProps?: object;

      /** Extra styles for the nav list itself, e.g. a different top gap. */
      listSx?: object;
    };
    appBar?: {
      content?: (props: object) => ReactNode;
      componentProps?: object;
    };
  };
  contentHeightFixed?: boolean;
}

export interface NavHeaderProps {
  hidden: boolean;
  navHover: boolean;
  settings: Settings;
  collapsedNavWidth: number;
  navigationBorderWidth: number;
  saveSettings: (values: Partial<Settings>) => void;
  toggleNavVisibility: () => void;
  navMenuBranding?: (props: object) => ReactNode;
  menuLockedIcon?: ReactNode;
  menuUnlockedIcon?: ReactNode;
}

export interface UserMenuProps {
  anchorEl: Element | null;
  onClose: () => void;
  anchorOrigin: PopoverOrigin;
  transformOrigin: PopoverOrigin;
}

export interface NavProfileProps {
  navHover: boolean;
  settings: Settings;
}

export interface NavLinkProps {
  item: NavLink;
  parent?: boolean;
  navHover?: boolean;
  settings: Settings;
  navVisible?: boolean;
  collapsedNavWidth: number;
  navigationBorderWidth: number;
  toggleNavVisibility: () => void;
  isSubToSub?: NavGroup | undefined;
}

export interface DrawerProps {
  hidden: boolean;
  navWidth: number;
  navHover: boolean;
  navVisible: boolean;
  children: ReactNode;
  settings: Settings;
  collapsedNavWidth: number;
  navigationBorderWidth: number;
  setNavHover: (value: boolean) => void;
  setNavVisible: (value: boolean) => void;
  navMenuProps?: object;
}

export interface NavigationProps {
  hidden: boolean;
  navWidth: number;
  navVisible: boolean;
  settings: Settings;
  children: ReactNode;
  collapsedNavWidth: number;
  navigationBorderWidth: number;
  setNavVisible: (value: boolean) => void;
  saveSettings: (values: Partial<Settings>) => void;
  toggleNavVisibility: () => void;
  verticalNavItems?: VerticalNavItemsType;
  navMenuContent?: (props: object) => ReactNode;
  navMenuBranding?: (props: object) => ReactNode;
  menuLockedIcon?: ReactNode;
  menuUnlockedIcon?: ReactNode;
  afterNavMenuContent?: (props: object) => ReactNode;
  beforeNavMenuContent?: (props: object) => ReactNode;
  navMenuProps?: object;
  navListSx?: object;
}

export interface AppBarProps {
  hidden: boolean;
  settings: Settings;
  saveSettings: (values: Partial<Settings>) => void;
  toggleNavVisibility: () => void;
  appBarContent?: (props: object) => ReactNode;
  appBarProps?: object;
}
