import {
  DataTableFooterProps,
  DataTableSkeletonOverlayProps,
} from '@/shared/interfaces/uiComponents';

declare module '@mui/x-data-grid' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface FooterPropsOverrides extends DataTableFooterProps {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface LoadingOverlayPropsOverrides extends Pick<
    DataTableSkeletonOverlayProps,
    'skeletonRowsCount'
  > {}
}

export {};
