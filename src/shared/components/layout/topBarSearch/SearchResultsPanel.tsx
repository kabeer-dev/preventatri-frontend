'use client';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';

import {thinScrollbarSx} from '@/shared/components/common/styles';
import {
  GLOBAL_SEARCH_LOADER_SIZE,
  SEARCH_RESULTS_ID,
} from '@/shared/constants/globalSearch';
import useTranslation from '@/shared/hooks/useTranslation';
import {SearchResultsPanelProps} from '@/shared/interfaces/search';

import SearchResultItem from './SearchResultItem';

const SearchResultsPanel = ({
  anchorEl,
  isOpen,
  query,
  results,
  isFetching,
  listRef,
  onListKeyDown,
  onResultClick,
}: SearchResultsPanelProps) => {
  const {t} = useTranslation();

  const renderBody = () => {
    if (isFetching) {
      return (
        <Box
          sx={{
            py: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <CircularProgress size={GLOBAL_SEARCH_LOADER_SIZE} />
          <Typography variant='body2' sx={{color: 'text.secondary'}}>
            {t('shell.searchLoading')}
          </Typography>
        </Box>
      );
    }

    if (results.length === 0) {
      return (
        <Box sx={{py: 8, textAlign: 'center'}}>
          <Typography variant='body2' sx={{color: 'text.secondary'}}>
            {t('shell.searchNoResults')}
          </Typography>
        </Box>
      );
    }

    return (
      <MenuList ref={listRef} onKeyDown={onListKeyDown} sx={{padding: 0}}>
        {results.map((result) => (
          <SearchResultItem
            key={`${result.type}-${result.id}`}
            result={result}
            onClick={onResultClick}
          />
        ))}
      </MenuList>
    );
  };

  return (
    <Popper
      open={isOpen && Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement='bottom-start'
      disablePortal
      sx={{width: '100%', zIndex: 'modal'}}
    >
      <Paper
        id={SEARCH_RESULTS_ID}
        elevation={8}
        sx={[{mt: 1, maxHeight: 400, overflowY: 'auto'}, thinScrollbarSx]}
      >
        <Box sx={{px: 4, py: 3}}>
          <Typography sx={{fontWeight: 600}}>
            {t('shell.searchResultsFor', {
              query,
              interpolation: {escapeValue: false},
            })}
          </Typography>
        </Box>

        <Divider sx={{my: 0}} />

        {renderBody()}
      </Paper>
    </Popper>
  );
};

export default SearchResultsPanel;
