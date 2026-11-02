import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomAvatar from '@/@core/components/mui/avatar';
import {getInitials} from '@/@core/utils/userUtils';
import {UserGridCellProps} from '@/shared/interfaces/uiComponents';

export const UserGridCell = ({
  firstName,
  lastName,
  meta,
  avatar,
  avatarColor = 'primary',
}: UserGridCellProps) => (
  <Box sx={{display: 'flex', alignItems: 'center', minWidth: 0}}>
    <CustomAvatar
      src={avatar}
      skin='light'
      color={avatarColor}
      sx={{mr: 3, width: 34, height: 34, fontSize: '0.875rem'}}
    >
      {getInitials({name: `${firstName} ${lastName}`})}
    </CustomAvatar>
    <Box sx={{display: 'flex', flexDirection: 'column', minWidth: 0}}>
      <Typography noWrap variant='bodyStrong'>
        {firstName} {lastName}
      </Typography>
      {meta && (
        <Typography noWrap variant='small' sx={{color: 'text.disabled'}}>
          {meta}
        </Typography>
      )}
    </Box>
  </Box>
);

export default UserGridCell;
