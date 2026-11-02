import {CustomColorToken} from '@/shared/types/common';

export interface SeverityConfig {
  glyph: string;
  labelKey: string;
  bg: CustomColorToken;
  fg: CustomColorToken;
}

export interface SeverityTile {
  glyph: string;
  bg: CustomColorToken;
  fg: CustomColorToken;
}

export interface SeverityIndicatorProps {
  flag?: string | null;
  label?: string;
}
