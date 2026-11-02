import {useTheme} from '@mui/material/styles';

import {FLAG_STATUS} from '@/shared/constants/common';
import {ACTIVE_FLAG_ACCENTS} from '@/shared/constants/flag';
import {FLAG_TO_SEVERITY, SEVERITY_LEVELS} from '@/shared/constants/severity';
import {
  ActiveFlagAccent,
  UseActiveFlagAccentParams,
} from '@/shared/interfaces/flag';

export default function useActiveFlagAccent({
  flagType,
}: UseActiveFlagAccentParams): ActiveFlagAccent {
  const {palette} = useTheme();

  const severity = FLAG_TO_SEVERITY[flagType];
  const {glyph, bg, fg} = SEVERITY_LEVELS[severity];

  const {edge, tileGlyphColor, glyphSize, isPulsing} =
    ACTIVE_FLAG_ACCENTS[severity];

  return {
    severity,
    color: FLAG_STATUS[flagType].color,
    glyph,
    glyphSize,
    tileGlyphColor,
    isPulsing,
    tint: palette.customColors[bg],
    ink: palette.customColors[fg],
    edge: palette.customColors[edge],
  };
}
