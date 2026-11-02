import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import {Control, Controller, FieldValues, Path} from 'react-hook-form';

interface RHFSwitchFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  disabled?: boolean;
}

const RHFSwitchField = <T extends FieldValues>({
  name,
  control,
  label,
  disabled = false,
}: RHFSwitchFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
          <Switch
            checked={Boolean(field.value)}
            onChange={(e) => field.onChange(e.target.checked)}
            color='primary'
            disabled={disabled}
          />
          {label && (
            <Typography variant='body2' sx={{fontWeight: 500}}>
              {label}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};

export default RHFSwitchField;
