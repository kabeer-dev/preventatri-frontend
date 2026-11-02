import {ReactNode} from 'react';

import {ThemeColor} from '@/@core/theme/types';
import {SystemRoleValue} from '@/shared/constants/common';
import {RecordRemoveAction} from '@/shared/constants/recordActions';

export interface PageHeadingProps {
  crumb?: string;
  title: string;
  hiddenForRoles?: SystemRoleValue[];
}

export type TopBarSide = 'left' | 'right';

export type TopBarContainers = Record<TopBarSide, HTMLElement | null>;

export interface TopBarContextValue {
  containers: TopBarContainers;
  setContainer: (params: {
    side: TopBarSide;
    element: HTMLElement | null;
  }) => void;
}

export interface TopBarSlotProps {
  side?: TopBarSide;
  children: ReactNode;
}

export interface SectionHeadingProps {
  title: string;
  meta?: ReactNode;
  action?: ReactNode;
}

export interface RecordHeadingProps {
  crumb: string;
  crumbHref?: string;
  name: string;
  avatar?: string;
  avatarColor?: ThemeColor;
  status?: ReactNode;
  identityLine?: string;
  nameInCrumb?: boolean;
}

export type UserDetailsHeadingProps = Pick<
  RecordHeadingProps,
  'name' | 'avatar' | 'avatarColor'
>;

export interface RecordHeaderActionsProps {
  onEdit: () => void;
  onRemove: () => void;
  removeAction: RecordRemoveAction;
}

/** A record page: main column fills the width, facts rail keeps a fixed width. */
export interface DetailSplitLayoutProps {
  main: ReactNode;
  rail: ReactNode;
}
