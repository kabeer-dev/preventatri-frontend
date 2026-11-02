'use client';

import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import {styled} from '@mui/material/styles';
import MuiToolbar, {ToolbarProps} from '@mui/material/Toolbar';

import {AppBarProps} from '@/@core/layouts/types';
import {layout} from '@/@core/theme/spacing';

const AppBar = styled(MuiAppBar)<MuiAppBarProps>(({theme}) => ({
  transition: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `0 ${layout.pageGutter}px`,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: theme.mixins.toolbar.minHeight,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const Toolbar = styled(MuiToolbar)<ToolbarProps>(({theme}) => ({
  width: '100%',
  padding: '0 !important',
  minHeight: `${theme.mixins.toolbar.minHeight}px !important`,
}));

const LayoutAppBar = ({
  settings,
  appBarProps,
  appBarContent: userAppBarContent,
  toggleNavVisibility,
  hidden,
  saveSettings,
}: AppBarProps) => {
  const {appBar} = settings;

  if (appBar === 'hidden') {
    return null;
  }

  let userAppBarStyle = {};
  if (appBarProps && (appBarProps as {sx?: object}).sx) {
    userAppBarStyle = (appBarProps as {sx?: object}).sx || {};
  }

  return (
    <AppBar
      elevation={0}
      color='default'
      className='layout-navbar'
      sx={{...userAppBarStyle}}
      position={appBar === 'fixed' ? 'sticky' : 'static'}
    >
      <Toolbar className='navbar-content-container'>
        {userAppBarContent &&
          userAppBarContent({
            hidden,
            settings,
            saveSettings,
            toggleNavVisibility,
          })}
      </Toolbar>
    </AppBar>
  );
};

export default LayoutAppBar;
