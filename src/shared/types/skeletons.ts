import {SkeletonCardProps} from '@/shared/interfaces/skeletons';

export type SkeletonRowLeading = 'none' | 'circle' | 'square';

export type SkeletonRowTrailing = 'none' | 'text' | 'chip' | 'button';

export type SkeletonRowLayout = 'stacked' | 'inline';

export type SkeletonCardHeader = 'none' | 'title' | 'profile';

export type SkeletonCardSurface = 'card' | 'plain';

export type SkeletonGridTemplate = {md?: string; lg: string};

export type PageSkeletonLayout = 'split' | 'column';

export type PageSkeletonBlock =
  | {type: 'card'; card: SkeletonCardProps; nested?: SkeletonCardProps}
  | {type: 'table'; titleInCard?: boolean}
  | {type: 'stats'; count: number}
  | {type: 'title'}
  | {type: 'text'};
