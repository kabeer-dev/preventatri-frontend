import {ReactNode} from 'react';

export interface AlertSummaryCounts {
  activeRedFlags?: number;
  activeYellowFlags?: number;
  greenFlags?: number;
  stableLast30Days?: number | null;
  slaBreaches?: number | null;
  averageResolutionMinutes?: number | null;
}

export interface AlertSummaryCardConfig {
  id: string;
  labelKey: string;
  scopeKey: string;
  glyph: string;
  tileBackground: string;
  tileColor: string;
  valueColor: string;
  countKey: keyof AlertSummaryCounts;
  href?: string;
  fallbackCountKey?: keyof AlertSummaryCounts;
  formatValue?: ({value}: {value: number}) => string;
}

export interface AlertSummaryCardProps {
  label: string;
  scope: string;
  glyph: string;
  tileBackground: string;
  tileColor: string;
  valueColor: string;
  value: ReactNode;
  href?: string;
}

export interface AlertSummaryCardsProps {
  cards: AlertSummaryCardConfig[];
  counts?: AlertSummaryCounts;
  isLoading?: boolean;
}
