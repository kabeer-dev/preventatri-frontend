'use client';

import {Theme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * The one breakpoint the caregiver shell splits at: `lg` and up is the dark
 * sidebar, below it the bottom tabs. Every caregiver screen that renders
 * differently on the two shells reads this, so they cannot split elsewhere.
 */
const useIsDesktop = () =>
  useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

export default useIsDesktop;
