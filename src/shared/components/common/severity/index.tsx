'use client';

import Box from '@mui/material/Box';

import Icon from '@/@core/components/icon';
import {radius} from '@/@core/theme/spacing';
import {DETAIL_EMPTY_VALUE} from '@/shared/constants/common';
import {SEVERITY_LEVELS, SEVERITY_PILL} from '@/shared/constants/severity';
import useTranslation from '@/shared/hooks/useTranslation';
import {SeverityIndicatorProps} from '@/shared/interfaces/severity';
import {getSeverityFromFlag} from '@/shared/utils/severity';

// Mapping happens here so no caller can drop a flag by gating on the mapped
// level: a flag the API sent that we do not map still shows its raw value, and
// only a record with no flag at all falls back to the empty-value placeholder.
const SeverityIndicator = ({flag, label}: SeverityIndicatorProps) => {
  const {t} = useTranslation();

  const level = getSeverityFromFlag({flag});

  if (!level)
    return (
      <Box component='span' sx={{color: 'text.secondary'}}>
        {flag?.trim() || DETAIL_EMPTY_VALUE}
      </Box>
    );

  const {glyph, labelKey, bg, fg} = SEVERITY_LEVELS[level];

  return (
    <Box
      component='span'
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: SEVERITY_PILL.paddingX,
        py: SEVERITY_PILL.paddingY,
        borderRadius: `${radius.full}px`,
        fontSize: SEVERITY_PILL.fontSize,
        fontWeight: SEVERITY_PILL.fontWeight,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        backgroundColor: `customColors.${bg}`,
        color: `customColors.${fg}`,
      }}
    >
      <Icon icon={glyph} fontSize='1.1em' aria-hidden />
      {label || t(labelKey)}
    </Box>
  );
};

export default SeverityIndicator;
