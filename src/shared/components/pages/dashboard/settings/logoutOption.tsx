import {Box, Checkbox, Typography} from '@mui/material';

import useTranslation from '@/shared/hooks/useTranslation';
import {useOTPContext} from '@/shared/providers/OTPExecutionProvider';

export const LogoutOption = () => {
  const {t} = useTranslation();

  const {extendPayloadData, otpMutationConfig} = useOTPContext();

  const isLogoutFromAllDevices =
    otpMutationConfig?.payload?.isLogoutFromAllDevices || false;

  return (
    <Box sx={{display: 'flex', alignItems: 'center', mt: 2}}>
      <Checkbox
        checked={isLogoutFromAllDevices}
        onChange={() =>
          extendPayloadData({
            isLogoutFromAllDevices: !isLogoutFromAllDevices,
          })
        }
        size='small'
        sx={{p: 0, mr: 1}}
      />
      <Typography variant='body2' sx={{color: 'text.secondary'}}>
        {t('auth.logoutFromAllDevices')}
      </Typography>
    </Box>
  );
};
