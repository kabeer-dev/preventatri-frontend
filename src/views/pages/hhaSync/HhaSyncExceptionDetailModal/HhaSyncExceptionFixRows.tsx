'use client';

import CustomChip from '@/@core/components/mui/chip';
import {
  HHA_SYNC_AFTER_FIX,
  HHA_SYNC_FIX_IN_CHIP,
} from '@/shared/constants/hhaSyncHistory';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncExceptionFixRowsProps} from '@/shared/interfaces/hhaSyncHistory';
import {
  getExceptionTypeMeta,
  resolveSyncChip,
} from '@/shared/utils/hhaSyncHistoryUtils';
import HhaSyncDetailRow from '@/views/pages/hhaSync/HhaSyncDetailRow';

const KEY = 'hhaSyncHistory.exceptions.detail';

const HhaSyncExceptionFixRows = ({type}: HhaSyncExceptionFixRowsProps) => {
  const {t} = useTranslation();
  const {fixIn} = getExceptionTypeMeta({type});
  const chip = resolveSyncChip({map: HHA_SYNC_FIX_IN_CHIP, value: fixIn, t});
  const afterFixKey = HHA_SYNC_AFTER_FIX[fixIn];

  return (
    <>
      <HhaSyncDetailRow label={t(`${KEY}.fixIn`)}>
        <CustomChip
          skin='light'
          size='small'
          label={chip.label}
          color={chip.color}
        />
      </HhaSyncDetailRow>
      {afterFixKey && (
        <HhaSyncDetailRow label={t(`${KEY}.afterFix`)}>
          {t(afterFixKey)}
        </HhaSyncDetailRow>
      )}
    </>
  );
};

export default HhaSyncExceptionFixRows;
