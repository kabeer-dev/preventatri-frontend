import {lighten, useTheme} from '@mui/material/styles';

import {
  DEFAULT_ALERT_SEVERITY,
  SEVERITY_ON_DARK_LIGHTEN,
  SEVERITY_TONE_TOKENS,
} from '@/shared/constants/alertReview';
import {SEVERITY_LEVELS} from '@/shared/constants/severity';
import {
  AlertSeverityTone,
  UseAlertSeverityToneParams,
} from '@/shared/interfaces/alertReview';
import {getSeverityFromFlag} from '@/shared/utils/severity';

const useAlertSeverityTone = ({
  flag,
}: UseAlertSeverityToneParams): AlertSeverityTone => {
  const {palette} = useTheme();

  const level = getSeverityFromFlag({flag}) ?? DEFAULT_ALERT_SEVERITY;
  const {glyph, labelKey} = SEVERITY_LEVELS[level];
  const tokens = SEVERITY_TONE_TOKENS[level];

  const bar = palette.customColors[tokens.bar];

  return {
    level,
    glyph,
    labelKey,
    bar,
    tint: palette.customColors[tokens.tint],
    ink: palette.customColors[tokens.ink],
    onDark: lighten(bar, SEVERITY_ON_DARK_LIGHTEN[level]),
  };
};

export default useAlertSeverityTone;
