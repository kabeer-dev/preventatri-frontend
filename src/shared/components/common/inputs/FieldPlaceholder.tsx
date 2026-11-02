import Box from '@mui/material/Box';

import {FieldPlaceholderProps} from '@/shared/interfaces/inputs';

const FieldPlaceholder = ({children}: FieldPlaceholderProps) => {
  return (
    <Box component='span' sx={{color: 'text.disabled'}}>
      {children}
    </Box>
  );
};

export default FieldPlaceholder;
