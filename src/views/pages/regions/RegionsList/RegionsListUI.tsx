'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import SegmentedTabs from '@/shared/components/common/inputs/SegmentedTabs';
import SkeletonCard from '@/shared/components/common/skeletons/SkeletonCard';
import DataTableFooter from '@/shared/components/common/table/DataTableFooter';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {TABLE_PAGINATION} from '@/shared/constants/common';
import {WIDGET_SKELETONS} from '@/shared/constants/pageSkeletons';
import useTranslation from '@/shared/hooks/useTranslation';
import {RegionsListUIProps} from '@/shared/interfaces/region';
import {getTotalPages} from '@/shared/utils/pagination';

import RegionCard from './RegionCard';

const RegionsListUI = ({
  regions,
  tabs,
  isLoading = false,
  paginationProps,
  onAddRegion = () => {},
  onEditRegion = () => {},
  onDeleteRegion = () => {},
  showAddButton = true,
  addButtonText,
}: RegionsListUIProps) => {
  const {t} = useTranslation();

  const showFooter =
    !!paginationProps &&
    getTotalPages({
      rowCount: paginationProps.rowCount,
      pageSize: paginationProps.pageSize,
    }) > 1;

  return (
    <>
      {showAddButton && (
        <TopBarSlot side='right'>
          <Button
            variant='contained'
            startIcon={<Icon icon='mdi:plus' fontSize={16} />}
            onClick={onAddRegion}
          >
            {addButtonText || t('region.table.addButton')}
          </Button>
        </TopBarSlot>
      )}

      <Box className='flex flex-col gap-4'>
        {tabs && (
          <Box>
            <SegmentedTabs {...tabs} flat />
          </Box>
        )}

        {isLoading &&
          regions.length === 0 &&
          Array.from(
            {length: WIDGET_SKELETONS.regionCard.count},
            (_, index) => (
              <SkeletonCard
                key={index}
                header='none'
                rows={1}
                row={{
                  leading: 'square',
                  leadingSize: WIDGET_SKELETONS.regionCard.iconTileSize,
                  trailing: 'button',
                }}
              >
                <SkeletonCard
                  surface='plain'
                  rows={WIDGET_SKELETONS.regionCard.coverageRows}
                  row={{lines: 1, trailing: 'chip'}}
                />
              </SkeletonCard>
            )
          )}

        {!isLoading && regions.length === 0 && (
          <Typography
            variant='body2'
            sx={{color: 'text.disabled', py: 16, textAlign: 'center'}}
          >
            {t('region.table.noRowsLabel')}
          </Typography>
        )}

        {/* A region saved a moment ago is stale here until the reload lands;
            editing it then would save the old counties back. */}
        {regions.map((region) => (
          <RegionCard
            key={region.id}
            region={region}
            disabled={isLoading}
            onEdit={onEditRegion}
            onDelete={onDeleteRegion}
          />
        ))}

        {showFooter && (
          <Card>
            <DataTableFooter
              page={paginationProps.page}
              pageSize={paginationProps.pageSize}
              rowCount={paginationProps.rowCount}
              pageSizeOptions={[...TABLE_PAGINATION.pageSizeOptions]}
              onPaginationChange={paginationProps.onPaginationModelChange}
            />
          </Card>
        )}
      </Box>
    </>
  );
};

export default RegionsListUI;
