import Typography from '@mui/material/Typography';

import {ErrorMessageProps} from '@/shared/interfaces/inputs';

function ErrorMessage({errorMsg}: ErrorMessageProps) {
  return (
    <Typography variant='body2' className='text-error text-[13px]'>
      {errorMsg}
    </Typography>
  );
}

export default ErrorMessage;
