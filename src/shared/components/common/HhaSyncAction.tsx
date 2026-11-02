'use client';

import Button from '@mui/material/Button';

import Icon from '@/@core/components/icon';
import {useHhaSyncFlow} from '@/shared/hooks/useHhaSyncFlow';
import useTranslation from '@/shared/hooks/useTranslation';

/**
 * Toolbar control that pulls records from HHAeXchange on demand.
 *
 * Rendered into DataTable's `actionSlot`, admin-only, on the patients,
 * caregivers, case managers and nurses lists. One press imports every
 * HHAeXchange resource -- there is no patients-only run -- so the control is
 * shared rather than duplicated per page, and the copy names the source rather
 * than a resource.
 *
 * All the state lives in useHhaSyncFlow so the already-oversized table
 * containers do not grow. `loading` is MUI v7's native Button prop -- @mui/lab's
 * LoadingButton is not used anywhere in this codebase.
 *
 * `loading` tracks the RUN, not the request, so the button stays busy across
 * navigation and reloads until the completion socket event arrives.
 */
const HhaSyncAction = () => {
  const {t} = useTranslation();
  const {handleSync, isSyncing, syncConfirmationModal} = useHhaSyncFlow();

  return (
    <>
      <Button
        variant='outlined'
        onClick={handleSync}
        loading={isSyncing}
        loadingPosition='start'
        startIcon={<Icon icon='mdi:sync' fontSize={20} />}
      >
        {isSyncing ? t('hhaSync.inProgressLabel') : t('hhaSync.button')}
      </Button>
      {syncConfirmationModal}
    </>
  );
};

export default HhaSyncAction;
