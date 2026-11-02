'use client';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import {controlHeight, radius} from '@/@core/theme/spacing';
import {TABLE_FOOTER} from '@/shared/constants/common';
import useTranslation from '@/shared/hooks/useTranslation';
import {DataTableFooterProps} from '@/shared/interfaces/uiComponents';
import {getPageRange, getTotalPages} from '@/shared/utils/pagination';

const PreviousIcon = () => (
  <Icon icon='mdi:arrow-left' fontSize={TABLE_FOOTER.arrowSize} />
);

const NextIcon = () => (
  <Icon icon='mdi:arrow-right' fontSize={TABLE_FOOTER.arrowSize} />
);

const DataTableFooter = ({
  page,
  pageSize,
  rowCount,
  pageSizeOptions,
  onPaginationChange,
}: DataTableFooterProps) => {
  const {t} = useTranslation();

  const totalPages = getTotalPages({rowCount, pageSize});
  const {from, to} = getPageRange({page, pageSize, rowCount});

  const isSinglePage = totalPages <= 1;
  const canNeverPaginate = rowCount <= Math.min(...pageSizeOptions);

  return (
    <Box
      className='flex w-full flex-wrap items-center gap-3'
      sx={{
        px: TABLE_FOOTER.paddingX,
        py: TABLE_FOOTER.paddingY,
        borderTop: '1px solid',
        borderColor: 'customColors.ruleStrong',
      }}
    >
      <Typography
        sx={{fontSize: TABLE_FOOTER.fontSize, color: 'text.disabled'}}
      >
        {t('table.showing', {from, to, total: rowCount})}
      </Typography>

      <Select
        value={pageSize}
        disabled={canNeverPaginate}
        onChange={(event) =>
          onPaginationChange({page: 0, pageSize: Number(event.target.value)})
        }
        sx={{
          minHeight: controlHeight.sm,
          height: controlHeight.sm,
          fontSize: TABLE_FOOTER.fontSize,
          borderRadius: `${radius.sm}px`,
          backgroundColor: 'background.paper',
        }}
      >
        {pageSizeOptions.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{fontSize: TABLE_FOOTER.fontSize}}
          >
            {t('table.perPage', {size: option})}
          </MenuItem>
        ))}
      </Select>

      <Pagination
        className='ml-auto'
        shape='rounded'
        count={totalPages}
        page={page + 1}
        hidePrevButton={isSinglePage}
        hideNextButton={isSinglePage}
        onChange={(_event, nextPage) =>
          onPaginationChange({page: nextPage - 1, pageSize})
        }
        sx={{
          '& .MuiPaginationItem-root': {
            m: 0,
            minWidth: 'auto',
            height: 'auto',
            px: TABLE_FOOTER.pageButtonPaddingX,
            py: TABLE_FOOTER.pageButtonPaddingY,
            borderRadius: `${radius.sm}px`,
            fontSize: TABLE_FOOTER.fontSize,
            color: 'text.secondary',
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            fontWeight: 600,
            color: 'common.white',
            backgroundColor: 'primary.main',
          },

          '& .MuiPaginationItem-root.Mui-selected:hover, & .MuiPaginationItem-root.Mui-selected.Mui-focusVisible':
            {
              backgroundColor: 'primary.dark',
            },
        }}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            slots={{previous: PreviousIcon, next: NextIcon}}
          />
        )}
      />
    </Box>
  );
};

export default DataTableFooter;
