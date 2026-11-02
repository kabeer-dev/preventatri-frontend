/**
 * The top bar's search field: a quiet adornment that warms up on hover and on
 * focus. Kept here so every top bar search looks like the same one control.
 */
export const topBarSearchFieldSx = {
  '& .MuiInputAdornment-root': {
    color: 'text.disabled',
    transition: 'color .2s ease-in-out',
  },
  '& .MuiOutlinedInput-root:hover .MuiInputAdornment-root, & .MuiOutlinedInput-root.Mui-focused .MuiInputAdornment-root':
    {color: 'text.secondary'},
  '& svg': {width: 17, height: 17},
};
