import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {SettingsSectionHeaderProps} from '@/shared/interfaces/settings';

const SettingsSectionHeader = ({
  title,
  subtitle,
  action,
}: SettingsSectionHeaderProps) => (
  <Box className='flex flex-wrap items-start justify-between gap-3 px-4.5 pt-4 pb-3'>
    <Box className='min-w-0'>
      <Typography variant='subtitle1' sx={{fontWeight: 700}}>
        {title}
      </Typography>
      <Typography variant='body2' sx={{color: 'text.secondary', mt: 0.5}}>
        {subtitle}
      </Typography>
    </Box>
    {action && <Box className='flex items-center gap-2'>{action}</Box>}
  </Box>
);

export default SettingsSectionHeader;
