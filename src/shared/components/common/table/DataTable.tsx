'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import {SxProps, Theme} from '@mui/material/styles';
import {
  DataGrid,
  GridEventListener,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel,
  GridValidRowModel,
  gridClasses,
} from '@mui/x-data-grid';

import SectionHeading from '@/shared/components/common/headers/SectionHeading';
import ListToolbar from '@/shared/components/common/listToolbar/ListToolbar';
import {TABLE_PAGINATION} from '@/shared/constants/common';
import {DataTableProps} from '@/shared/interfaces/uiComponents';
import {getTotalPages} from '@/shared/utils/pagination';

import DataTableCardHeader from './DataTableCardHeader';
import DataTableFooter from './DataTableFooter';
import DataTableSkeletonOverlay from './DataTableSkeletonOverlay';
import {getDataTableGridStyles} from './styles';

const DataTable = <T,>({
  rows,
  columns,
  title,
  titleMeta,
  titleInCard = false,
  hideTotal = false,
  titleAction,
  getRowId,
  loading = false,
  noRowsLabel,
  defaultPageSize = TABLE_PAGINATION.defaultPageSize,
  pageSizeOptions = [...TABLE_PAGINATION.pageSizeOptions],
  rowHeight = TABLE_PAGINATION.rowHeight,
  onRowClick,
  getRowClassName,
  getRowHeight,
  toolbar,
  serverSidePagination,
  selection,
  gridSx,
}: DataTableProps<T>) => {
  const [localPaginationModel, setLocalPaginationModel] =
    useState<GridPaginationModel>({
      page: 0,
      pageSize: defaultPageSize,
    });

  const paginationModel = serverSidePagination
    ? {
        page: serverSidePagination.page,
        pageSize: serverSidePagination.pageSize,
      }
    : localPaginationModel;

  const handlePaginationModelChange = serverSidePagination
    ? serverSidePagination.onPaginationModelChange
    : setLocalPaginationModel;

  const gridRows: T[] = loading && serverSidePagination ? [] : rows;

  const skeletonHeight =
    loading && serverSidePagination
      ? serverSidePagination.pageSize * rowHeight
      : undefined;

  const rowCount = serverSidePagination?.rowCount ?? rows.length;

  const hideFooter =
    getTotalPages({rowCount, pageSize: paginationModel.pageSize}) <= 1;

  // eslint-disable-next-line
  const resolveRowId = getRowId || ((row: any) => row.id);

  const isRowSelectable = ({row}: {row: T}) =>
    selection?.isRowSelectable?.({row}) ?? true;

  // "Select all" arrives as an exclude model, so it is resolved against the
  // rows on screen before it leaves the table.
  const handleSelectionChange = ({type, ids}: GridRowSelectionModel) => {
    const selectedIds =
      type === 'include'
        ? Array.from(ids)
        : gridRows
            .filter((row) => isRowSelectable({row}))
            .map((row) => resolveRowId(row))
            .filter((id) => !ids.has(id));

    selection?.onChange({ids: selectedIds.map(String)});
  };

  // Ticking a row's checkbox must not also open the row.
  // eslint-disable-next-line local-rules/enforce-single-object-param
  const handleRowClick: GridEventListener<'rowClick'> = (params, event) => {
    const isCheckboxClick = (event.target as HTMLElement).closest(
      `.${gridClasses.cellCheckbox}`
    );

    if (!isCheckboxClick) onRowClick?.(params);
  };

  const sx = [
    getDataTableGridStyles({clickableRows: !!onRowClick, skeletonHeight}),
    ...(Array.isArray(gridSx) ? gridSx : [gridSx]),
  ] as SxProps<Theme>;

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
      {title && !titleInCard && (
        <SectionHeading title={title} meta={titleMeta} />
      )}

      {/* The toolbar sits above the table card rather than inside it, so the
          card holds nothing but the rows and their footer. */}
      {toolbar && <ListToolbar {...toolbar} />}

      <Card>
        {title && titleInCard && (
          <DataTableCardHeader
            title={title}
            meta={titleMeta}
            total={loading || hideTotal ? undefined : rowCount}
            action={titleAction}
          />
        )}

        <DataGrid
          autoHeight
          loading={loading}
          rows={gridRows}
          columns={columns}
          disableRowSelectionOnClick
          disableColumnMenu
          paginationMode={serverSidePagination ? 'server' : 'client'}
          rowCount={serverSidePagination?.rowCount}
          hideFooter={hideFooter}
          pageSizeOptions={pageSizeOptions}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          slots={{
            footer: DataTableFooter,
            ...(serverSidePagination && {
              loadingOverlay: DataTableSkeletonOverlay,
            }),
          }}
          getRowId={resolveRowId}
          {...(selection && {
            checkboxSelection: true,
            rowSelectionModel: {
              type: 'include',
              ids: new Set(selection.selectedIds),
            },
            onRowSelectionModelChange: handleSelectionChange,
            isRowSelectable: ({row}: GridRowParams<GridValidRowModel>) =>
              isRowSelectable({row: row as T}),
          })}
          rowHeight={rowHeight}
          onRowClick={selection && onRowClick ? handleRowClick : onRowClick}
          getRowClassName={getRowClassName}
          getRowHeight={getRowHeight}
          sx={sx}
          {...(noRowsLabel && {localeText: {noRowsLabel}})}
          slotProps={{
            loadingOverlay: {
              variant: 'skeleton',
              noRowsVariant: 'skeleton',
              ...(serverSidePagination && {
                skeletonRowsCount: serverSidePagination.pageSize,
              }),
            },
            footer: {
              page: paginationModel.page,
              pageSize: paginationModel.pageSize,
              rowCount,
              pageSizeOptions,
              onPaginationChange: handlePaginationModelChange,
            },
          }}
        />
      </Card>
    </Box>
  );
};

export default DataTable;
