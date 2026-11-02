import {ReactNode} from 'react';

import {ThemeColor} from '@/@core/theme/types';
import {StatsCardSeverity} from '@/shared/types/severity';

export interface StatsCardProps {
  title: string;
  icon?: ReactNode;

  // Draws the severity glyph on its severity tile instead of `icon` and
  // `color`, so severity counts read the same as the Alerts page cards.
  severity?: StatsCardSeverity;
  stats: ReactNode;
  color?: ThemeColor;
  subtitle?: string;

  // When true, tints the whole card with the color's light shade (used by the
  // triage priority cards). Defaults to a plain white card.
  tinted?: boolean;

  // Drill-down target: only the drill label links here, not the whole card.
  href?: string;

  drillLabel?: string;

  // Change against the previous period, drawn beside the value.
  delta?: ReactNode;

  // A pill after the title, such as "Now" for a live figure.
  scopeLabel?: string;

  // Shorter card with a tighter gap above the value, for dense rows of tiles.
  compact?: boolean;
}
