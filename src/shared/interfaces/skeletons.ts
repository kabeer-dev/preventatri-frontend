import {ReactNode} from 'react';

import {SxProps, Theme} from '@mui/material/styles';
import {TypographyProps} from '@mui/material/Typography';

import {
  PageSkeletonBlock,
  PageSkeletonLayout,
  SkeletonCardHeader,
  SkeletonCardSurface,
  SkeletonGridTemplate,
  SkeletonRowLayout,
  SkeletonRowLeading,
  SkeletonRowTrailing,
} from '@/shared/types/skeletons';

export interface SkeletonTextProps {
  variant?: TypographyProps['variant'];
  width?: number | string;
  sx?: SxProps<Theme>;
}

export interface SkeletonRowsProps {
  rows?: number;
}

export interface ChipSkeletonProps {
  width?: number | string;
  height?: number;
  sx?: SxProps<Theme>;
}

export interface TableSkeletonProps extends SkeletonRowsProps {
  hasTitle?: boolean;

  /** Mirrors DataTable's titleInCard: the title bar sits inside the card. */
  titleInCard?: boolean;
}

export interface SkeletonRowProps {
  leading?: SkeletonRowLeading;
  leadingSize?: number;
  lines?: number;
  layout?: SkeletonRowLayout;
  trailing?: SkeletonRowTrailing;
  sx?: SxProps<Theme>;
}

export interface CardRowsSkeletonProps {
  rows?: number;
  row?: SkeletonRowProps;
  sx?: SxProps<Theme>;
}

export interface SkeletonCardProps {
  surface?: SkeletonCardSurface;
  header?: SkeletonCardHeader;
  rows?: number;
  row?: SkeletonRowProps;
  columns?: 1 | 2;
  divided?: boolean;
  hasAction?: boolean;
  children?: ReactNode;
}

export interface SplitLayoutSkeletonProps {
  template: SkeletonGridTemplate;
  columns: ReactNode[];
  hasRecordHeading?: boolean;
  recordHeadingLines?: number;
  maxWidth?: number | string;
}

export interface CenteredColumnSkeletonProps {
  maxWidth: number;
  children: ReactNode;
}

export interface PageSkeletonProps {
  layout: PageSkeletonLayout;
  columns: PageSkeletonBlock[][];
  template?: SkeletonGridTemplate;
  hasRecordHeading?: boolean;
  recordHeadingLines?: number;
  maxWidth?: number;
}

export interface PageSkeletonBlockProps {
  block: PageSkeletonBlock;
}

export interface SettingsSectionHeaderSkeletonProps {
  hasAction?: boolean;
  hasChip?: boolean;
}
