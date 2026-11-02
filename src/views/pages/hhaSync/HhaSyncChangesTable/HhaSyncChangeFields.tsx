'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  HHA_SYNC_ARROW,
  HHA_SYNC_CREATED_ACTION,
} from '@/shared/constants/hhaSyncHistory';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  HhaSyncChangeEntry,
  HhaSyncChangeFieldsProps,
} from '@/shared/interfaces/hhaSyncHistory';
import {
  formatChangeValue,
  resolveFieldLabel,
} from '@/shared/utils/hhaSyncHistoryUtils';

// "Field: old → new" per changed field; older rows may only say a patient field changed.
const HhaSyncChangeFields = ({entries, action}: HhaSyncChangeFieldsProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();

  const isCreated = action === HHA_SYNC_CREATED_ACTION;

  const describe = (entry: HhaSyncChangeEntry): string => {
    if (entry.redacted) return t('hhaSyncHistory.fields.changed');

    const to = formatChangeValue({
      value: entry.to,
      label: entry.toLabel,
      t,
      zone,
    });

    if (isCreated) return to;

    const from = formatChangeValue({
      value: entry.from,
      label: entry.fromLabel,
      t,
      zone,
    });

    return `${from} ${HHA_SYNC_ARROW} ${to}`;
  };

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', py: 1.5, minWidth: 0}}>
      {entries.map((entry) => (
        <Typography
          key={entry.field}
          variant='body2'
          sx={{whiteSpace: 'normal'}}
        >
          <Box component='span' sx={{fontWeight: 500}}>
            {resolveFieldLabel({field: entry.field, t})}:
          </Box>{' '}
          {describe(entry)}
        </Typography>
      ))}
    </Box>
  );
};

export default HhaSyncChangeFields;
