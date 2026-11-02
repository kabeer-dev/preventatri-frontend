import {Components} from '@mui/material/styles';

const FormHelperText = (): Components['MuiFormHelperText'] => {
  return {
    styleOverrides: {
      contained: {
        marginLeft: 0,
        marginRight: 0,
      },
    },
  };
};

export default FormHelperText;
