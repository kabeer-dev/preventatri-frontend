'use client';

import {useState} from 'react';

import Box, {BoxProps} from '@mui/material/Box';
import {styled} from '@mui/material/styles';

import {LayoutProps} from '@/@core/layouts/types';
import {layout} from '@/@core/theme/spacing';
import themeConfig from '@/configs/themeConfig';

import AppBar from './components/vertical/appBar';
import Navigation from './components/vertical/navigation';

const VerticalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex',
});

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
});

const ContentWrapper = styled('main')(({theme}) => ({
  flexGrow: 1,
  width: '100%',

  // A flex column so a page loader can grow to the full content height and
  // sit in the middle of it, on every shell the same way.
  display: 'flex',
  flexDirection: 'column',
  padding: `${layout.pageGutterY}px ${layout.pageGutter}px`,
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const VerticalLayout = (props: LayoutProps) => {
  const {settings, children, scrollToTop, verticalLayoutProps} = props;

  const {skin, navHidden} = settings;
  const {navigationSize, collapsedNavigationSize} = themeConfig;
  const navWidth = navigationSize;
  const navigationBorderWidth = skin === 'bordered' ? 1 : 0;
  const collapsedNavWidth = collapsedNavigationSize;

  const [navVisible, setNavVisible] = useState<boolean>(false);

  const toggleNavVisibility = () => setNavVisible(!navVisible);

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        {/* Navigation Menu */}
        {navHidden &&
        !(
          navHidden &&
          (settings as {lastLayout?: string}).lastLayout === 'horizontal'
        ) ? null : (
          <Navigation
            navWidth={navWidth}
            navVisible={navVisible}
            setNavVisible={setNavVisible}
            collapsedNavWidth={collapsedNavWidth}
            toggleNavVisibility={toggleNavVisibility}
            navigationBorderWidth={navigationBorderWidth}
            navMenuContent={verticalLayoutProps?.navMenu?.content}
            navMenuBranding={verticalLayoutProps?.navMenu?.branding}
            menuLockedIcon={verticalLayoutProps?.navMenu?.lockedIcon}
            verticalNavItems={verticalLayoutProps?.navMenu?.navItems}
            navMenuProps={verticalLayoutProps?.navMenu?.componentProps}
            menuUnlockedIcon={verticalLayoutProps?.navMenu?.unlockedIcon}
            afterNavMenuContent={verticalLayoutProps?.navMenu?.afterContent}
            beforeNavMenuContent={verticalLayoutProps?.navMenu?.beforeContent}
            navListSx={verticalLayoutProps?.navMenu?.listSx}
            {...props}
          />
        )}
        <MainContentWrapper
          className='layout-content-wrapper'
          sx={{...(props.contentHeightFixed && {maxHeight: '100vh'})}}
        >
          {/* AppBar Component */}
          <AppBar
            toggleNavVisibility={toggleNavVisibility}
            appBarContent={verticalLayoutProps?.appBar?.content}
            appBarProps={verticalLayoutProps?.appBar?.componentProps}
            {...props}
          />

          {/* Content */}
          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(props.contentHeightFixed && {
                overflow: 'hidden',
                '& > :first-of-type': {height: '100%'},
              }),
            }}
          >
            {children}
          </ContentWrapper>
        </MainContentWrapper>
      </VerticalLayoutWrapper>

      {/* Scroll to top button */}
      {scrollToTop ? scrollToTop(props) : null}
    </>
  );
};

export default VerticalLayout;
