import Box from '@mui/material/Box';
import {alpha} from '@mui/material/styles';

import Icon from '@/@core/components/icon';
import {radius} from '@/@core/theme/spacing';
import {PULSE_RING, PULSE_RING_DURATION} from '@/shared/constants/animations';
import {ACTIVE_FLAG_MODAL_SIZES} from '@/shared/constants/flag';
import {SeverityIconTileProps} from '@/shared/interfaces/flag';

const SeverityIconTile = ({accent}: SeverityIconTileProps) => {
  const {edge, glyph, glyphSize, tileGlyphColor, isPulsing} = accent;
  const {iconTile, iconRing} = ACTIVE_FLAG_MODAL_SIZES;

  return (
    <Box
      aria-hidden
      sx={{
        position: 'relative',
        width: iconTile,
        height: iconTile,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        borderRadius: `${radius.md}px`,
        backgroundColor: edge,
        color: tileGlyphColor,
        fontSize: glyphSize,
        lineHeight: 1,
        boxShadow: `0 0 0 ${iconRing}px ${alpha(edge, 0.16)}`,
        ...(isPulsing && {
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: -iconRing,
            borderRadius: `${radius.lg}px`,
            border: '2px solid',
            borderColor: edge,
            opacity: 0,
            animation: `${PULSE_RING} ${PULSE_RING_DURATION} ease-out infinite`,
            '@media (prefers-reduced-motion: reduce)': {animation: 'none'},
          },
        }),
      }}
    >
      <Icon icon={glyph} fontSize='inherit' />
    </Box>
  );
};

export default SeverityIconTile;
