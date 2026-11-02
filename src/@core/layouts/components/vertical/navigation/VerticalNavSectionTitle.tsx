'use client';

import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import {styled} from '@mui/material/styles';
import Typography, {TypographyProps} from '@mui/material/Typography';

import {NavSectionTitle} from '@/@core/layouts/types';
import {Settings} from '@/shared/providers/SettingsProvider';

interface Props {
  item: NavSectionTitle;
  navHover: boolean;
  settings: Settings;
}

const ListSubheaderStyled = styled(ListSubheader)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  lineHeight: 1,
  padding: theme.spacing(3.5, 0, 1.75),
  transition: 'padding-left .25s ease-in-out',
  backgroundColor: 'transparent',
}));

const TypographyStyled = styled(Typography)<TypographyProps>(({theme}) => ({
  color: theme.palette.customColors.shellMuted,
  fontWeight: 600,
  fontSize: '0.6875rem',
  letterSpacing: '1.1px',
  textTransform: 'uppercase',
}));

const VerticalNavSectionTitle = ({item, navHover, settings}: Props) => {
  const {navCollapsed} = settings;

  return (
    <ListSubheaderStyled
      disableSticky
      sx={{
        ...(navCollapsed && !navHover ? {px: 2} : {px: 5.5}),
      }}
    >
      {navCollapsed && !navHover ? (
        <Divider
          sx={{
            width: '100%',
            borderColor: 'customColors.shellActive',
          }}
        />
      ) : (
        <TypographyStyled noWrap>{item.sectionTitle}</TypographyStyled>
      )}
    </ListSubheaderStyled>
  );
};

export default VerticalNavSectionTitle;
