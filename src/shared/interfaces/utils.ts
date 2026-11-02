import {ReactNode} from 'react';

import {LinkProps} from 'next/link';
import {ToastPosition} from 'react-hot-toast';

export interface SiteMapLink {
  url: string;
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastModified: Date;
}

export interface LocaleLinkProps extends Omit<LinkProps, 'href'> {
  href: string;
  className?: string;

  // Optional so the component can be passed to MUI's polymorphic `component`
  // prop, where MUI supplies the children rather than the caller.
  children?: ReactNode;
}

export interface RequestParams {
  endpoint: string;
  payload?: any;
  isSubRoute?: boolean;
}

export interface ShowToastProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  id?: string | number;
  position?: ToastPosition | undefined;
}

export interface ServerRequestParams {
  endpoint: string;
  cookieHeader?: string;
}

export interface DurationLabels {
  hour: string;
  hours: string;
  minute: string;
  minutes: string;
  noExpiry: string;
}

export interface FormatDurationLabelParams {
  seconds: number | null;
  labels: DurationLabels;
}

/** One day's worth of a list, as `groupByDay` returns it. */
export interface DayGroup<T> {
  label: string;
  items: T[];

  /** The calendar date, `yyyy-MM-dd`. */
  key: string;
}
