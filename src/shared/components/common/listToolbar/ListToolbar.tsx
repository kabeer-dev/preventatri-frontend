'use client';

import Box from '@mui/material/Box';

import SegmentedTabs from '@/shared/components/common/inputs/SegmentedTabs';
import {ListToolbarProps} from '@/shared/interfaces/listToolbar';

import AddFilterMenu from './AddFilterMenu';
import AppliedFilterChips from './AppliedFilterChips';
import ListSearchField from './ListSearchField';

const ListToolbar = ({tabs, search, filters}: ListToolbarProps) => {
  const hasFilters = !!filters?.fields.length;

  if (!tabs && !search && !hasFilters) return null;

  return (
    <Box className='flex flex-col gap-2.5'>
      <Box className='flex flex-wrap items-center gap-2.5'>
        {tabs && <SegmentedTabs {...tabs} flat />}

        {(search || hasFilters) && (
          <Box className='ml-auto flex w-full min-w-0 items-center gap-2.5 sm:w-auto'>
            {search && <ListSearchField {...search} />}
            {filters && hasFilters && <AddFilterMenu {...filters} />}
          </Box>
        )}
      </Box>

      {filters && <AppliedFilterChips {...filters} />}
    </Box>
  );
};

export default ListToolbar;
