'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import useThemeColors from '@/@core/hooks/useThemeColors';
import Link from '@/shared/components/common/localeLink';
import {
  DETAIL_ROUTE_BY_TYPE,
  SEARCH_RESULT_CHIP_SIZE,
  SEARCH_RESULT_ICON_SIZE,
  SEARCH_RESULT_ICONS,
} from '@/shared/constants/globalSearch';
import {SearchResultItemProps} from '@/shared/interfaces/search';
import {getSearchResultColor} from '@/shared/utils/globalSearch';

const SearchResultItem = ({result, onClick}: SearchResultItemProps) => {
  const {id, type, name, subtitle} = result;

  const themeColors = useThemeColors();

  const Icon = SEARCH_RESULT_ICONS[type];

  const {color: mainColor, backgroundColor: bgColor} =
    themeColors[getSearchResultColor({type})].light;

  return (
    <MenuItem
      component={Link}
      href={DETAIL_ROUTE_BY_TYPE[type]({id})}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        px: 4,
        py: 2.5,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <Avatar
        sx={{
          width: SEARCH_RESULT_CHIP_SIZE,
          height: SEARCH_RESULT_CHIP_SIZE,
          flexShrink: 0,
          bgcolor: bgColor,
          color: mainColor,
        }}
      >
        <Icon size={SEARCH_RESULT_ICON_SIZE} />
      </Avatar>
      <Box sx={{flex: 1, overflow: 'hidden'}}>
        <Typography
          variant='subtitle2'
          sx={{
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </Typography>
        <Typography
          variant='body2'
          sx={{
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </MenuItem>
  );
};

export default SearchResultItem;
