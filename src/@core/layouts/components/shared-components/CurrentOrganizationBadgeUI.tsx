import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {MyOrganization} from '@/shared/interfaces/auth';

interface CurrentOrganizationBadgeUIProps {
  organizations: MyOrganization[];
  currentName: string;
  isSwitching: boolean;
  anchorEl: HTMLElement | null;
  onOpen: (element: HTMLElement) => void;
  onClose: () => void;
  onSelect: (organization: MyOrganization) => void;
}

const CurrentOrganizationBadgeUI = ({
  organizations,
  currentName,
  isSwitching,
  anchorEl,
  onOpen,
  onClose,
  onSelect,
}: CurrentOrganizationBadgeUIProps) => (
  <>
    <ButtonBase
      title={currentName}
      disabled={isSwitching}
      onClick={(event) => onOpen(event.currentTarget)}
      sx={{
        gap: 1.5,
        minWidth: 0,
        maxWidth: {xs: 150, sm: 240},
        px: 2.5,
        py: 1.5,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        color: 'text.secondary',
        '&:hover': {backgroundColor: 'customColors.surfaceRaised'},
      }}
    >
      <Icon icon='mdi:domain' fontSize='1.125rem' />
      <Typography
        noWrap
        variant='body2'
        sx={{fontWeight: 500, color: 'text.primary'}}
      >
        {currentName}
      </Typography>
      <Icon icon='mdi:unfold-more-horizontal' fontSize='1.125rem' />
    </ButtonBase>

    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      slotProps={{
        paper: {sx: {width: 230, maxHeight: 280, overflowY: 'auto'}},
      }}
    >
      {organizations.map((organization) => (
        <MenuItem
          key={organization.organizationId}
          selected={organization.isCurrent}
          onClick={() => onSelect(organization)}
          sx={{gap: 2}}
        >
          <Box sx={{minWidth: 0, flexGrow: 1}}>
            <Typography noWrap sx={{fontSize: '0.875rem'}}>
              {organization.organizationName}
            </Typography>
          </Box>
          {organization.isCurrent && (
            <Icon icon='mdi:check' fontSize='1.125rem' />
          )}
        </MenuItem>
      ))}
    </Menu>
  </>
);

export default CurrentOrganizationBadgeUI;
