import Typography from '@mui/material/Typography';

import typography from '@/@core/theme/typography';
import {FieldLabelProps} from '@/shared/interfaces/inputs';

const FieldLabel = ({htmlFor, id, children}: FieldLabelProps) => {
  return (
    <Typography
      component='label'
      htmlFor={htmlFor}
      id={id}
      sx={{
        ...typography.small,
        fontWeight: 600,
        lineHeight: 1.2,
        color: 'text.secondary',
        mb: '6px',
      }}
    >
      {children}
    </Typography>
  );
};

export default FieldLabel;
