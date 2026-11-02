import {Components} from '@mui/material/styles';

/**
 * v9 replaced `ListItemIcon`'s hardcoded `minWidth: 56` with
 * `theme.spacing(4.5)`, which MUI documents as 36px against its own 8px unit.
 * This project's spacing unit is 0.25rem, so the same expression resolves to
 * 18px and every icon column in the app collapses.
 *
 * Pinned back to the v7 value rather than to MUI's intended 36px, so the
 * upgrade stays a no-op visually and any change to this measurement is a
 * separate, deliberate one.
 */
const ListItemIcon = (): Components['MuiListItemIcon'] => ({
  styleOverrides: {
    root: {minWidth: 56},
  },
});

export default ListItemIcon;
