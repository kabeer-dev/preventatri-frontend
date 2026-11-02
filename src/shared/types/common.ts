import {ChangeEvent} from 'react';

import {Palette} from '@mui/material/styles';

import {ThemeColor} from '@/@core/theme/types';

export type OnChangeEvent = ChangeEvent<HTMLInputElement>;

export type TranslateFunction = (
  key: string,
  args?: Record<string, any>
) => string;

// A status chip's colour: the theme palette plus MUI's neutral `default`, which
// statuses without a severity (upcoming, skipped, voided) render as.
export type StatusColor = ThemeColor | 'default';

export type CustomColorToken = keyof Palette['customColors'];
