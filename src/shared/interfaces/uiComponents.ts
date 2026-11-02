import {ReactNode} from 'react';

import {AutocompleteProps} from '@mui/material/Autocomplete';
import {SxProps, Theme} from '@mui/material/styles';
import {TextFieldProps} from '@mui/material/TextField';
import {
  GridColDef,
  GridLoadingOverlayProps,
  GridRowClassNameParams,
  GridRowParams,
} from '@mui/x-data-grid';

import {ThemeColor} from '@/@core/theme/types';
import {ServerSideTablePaginationProps} from '@/shared/interfaces/hooks';
import {ListToolbarProps} from '@/shared/interfaces/listToolbar';

export interface CustomDrawerProps {
  children: ReactNode;
  appBarContent: ReactNode;
  sidebarContent: ReactNode;
  window?: () => Window & typeof globalThis;
  mobileOpen: boolean;
  handleDrawerTransitionEnd: () => void;
  handleDrawerClose: () => void;
}

export interface CustomAutocompleteProps<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> extends Omit<
  AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  'renderInput'
> {
  textFieldProps?: TextFieldProps;
  rootClasses?: string;
  listItemClasses?: string;
}

export interface PanelCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  iconColor?: string;
  iconBackground?: string;

  actionLabel?: string;
  actionHref?: string;

  bodyPadding?: number;
  children: ReactNode;
}

// The identity cell every table leads with: avatar, name and a quiet second
// line.
export interface UserGridCellProps {
  firstName: string;
  lastName: string;

  // The quiet second line under the name: an email on a staff row, the
  // identity line ("84 - F - CHF") on a patient row.
  meta?: string;
  avatar?: string;
  avatarColor?: ThemeColor;
}

// Row checkboxes for a bulk action. Covers the rows on screen only: with
// server-side pages the table never holds the others.
export interface DataTableSelection<T> {
  selectedIds: string[];
  onChange: ({ids}: {ids: string[]}) => void;
  isRowSelectable?: ({row}: {row: T}) => boolean;
}

// The shared list table: rows, columns and the toolbar that sits above the
// card.
export interface DataTableProps<T> {
  rows: T[];
  columns: GridColDef[];
  title?: string;

  /** The quiet note after the title, e.g. "in visit order". */
  titleMeta?: ReactNode;
  titleInCard?: boolean;

  // Leaves the count pill out of the in-card header, for a table whose rows
  // are not loaded from the API yet and would otherwise claim "0 total".
  hideTotal?: boolean;
  titleAction?: ReactNode;
  getRowId?: (row: T) => string | number;
  loading?: boolean;
  noRowsLabel?: string;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  rowHeight?: number;
  onRowClick?: (params: GridRowParams) => void;
  toolbar?: ListToolbarProps;
  serverSidePagination?: ServerSideTablePaginationProps;
  selection?: DataTableSelection<T>;

  // Lets a caller mark a row (e.g. the selected one in a master/detail
  // layout) with its own class, styled via `gridSx` below.
  getRowClassName?: (params: GridRowClassNameParams) => string;

  // 'auto' lets a row grow with multi-line cells (e.g. a list of changes).
  getRowHeight?: () => number | 'auto';

  /** Grid styles on top of the shared ones, for the one table that needs more. */
  gridSx?: SxProps<Theme>;
}

export interface NowTagProps {
  label?: string;
}

export interface DataTableCardHeaderProps {
  title: string;
  meta?: ReactNode;

  /** Left out while the rows are loading, so the pill never shows a stale 0. */
  total?: number;
  action?: ReactNode;
}

export interface DataTableSkeletonOverlayProps extends GridLoadingOverlayProps {
  skeletonRowsCount?: number;
}

export interface DataTableFooterProps {
  page: number;
  pageSize: number;
  rowCount: number;
  pageSizeOptions: number[];
  onPaginationChange: ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) => void;
}

// One label/value pair on a record's facts card. The value is a node so a fact
// whose answer is a severity can render the shared pill rather than its bare
// colour word.
export interface RequiredMarkProps {
  fontSize?: string;
}

export interface DetailFact {
  label: string;
  value: ReactNode;

  // Spans both columns of the stacked grid, for a value too long to sit in one.
  wide?: boolean;
}

export interface DetailFactsCardProps {
  title: string;
  facts: DetailFact[];

  // Rail reading: label beside value on one line instead of the stacked
  // two-column grid.
  inline?: boolean;
  inlineLabelWidth?: number;

  // Rules a line under each inline row, for a long list of facts.
  divided?: boolean;
  footer?: ReactNode;
}

export interface EmptyLineProps {
  text: string;
  sx?: SxProps<Theme>;
}

export interface CardRowProps {
  children: ReactNode;

  /** Give either a destination or a handler, never both. */
  href?: string;
  onClick?: () => void;

  /** What sits before the text: an avatar, a time, a due label. */
  leading?: ReactNode;

  /** What sits after it: a chevron, a count, a status. */
  trailing?: ReactNode;

  /** The first row of a card has no hairline above it. */
  isFirst?: boolean;

  /** `muted` for a row that is done; `selected` for the chosen one in a picker. */
  tone?: 'default' | 'muted' | 'selected';
  minHeight?: number;
}

// The "it is with the nurse" screen: a tinted icon, a heading and a line or
// two under it, then whatever the screen puts after (a next step, an action).
export interface SentStateProps {
  icon: string;
  color: 'success' | 'error';
  title: string;
  lines: string[];

  /** 'start' for a dialog body; the full screens centre. */
  align?: 'start' | 'center';
  children?: ReactNode;
  sx?: SxProps<Theme>;
}
