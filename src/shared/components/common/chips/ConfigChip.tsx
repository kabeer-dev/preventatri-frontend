'use client';

import CustomChip from '@/@core/components/mui/chip';
import useTranslation from '@/shared/hooks/useTranslation';
import {ConfigChipProps} from '@/shared/interfaces/workItem';

// Status / priority / type pill, driven by a {value, labelKey, color} config.
const ConfigChip = ({config, fallbackLabel}: ConfigChipProps) => {
  const {t} = useTranslation();

  return (
    <CustomChip
      skin='light'
      size='small'
      label={config ? t(config.labelKey) : fallbackLabel || ''}
      color={config?.color ?? 'secondary'}
      sx={{'& .MuiChip-label': {lineHeight: '18px'}}}
    />
  );
};

export default ConfigChip;
