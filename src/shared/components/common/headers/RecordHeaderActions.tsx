'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Icon from '@/@core/components/icon';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {RECORD_REMOVE_ACTION} from '@/shared/constants/recordActions';
import useTranslation from '@/shared/hooks/useTranslation';
import {RecordHeaderActionsProps} from '@/shared/interfaces/layout';

const RecordHeaderActions = ({
  onEdit,
  onRemove,
  removeAction,
}: RecordHeaderActionsProps) => {
  const {t} = useTranslation();

  const remove = RECORD_REMOVE_ACTION[removeAction];

  return (
    <TopBarSlot side='right'>
      <Box className='flex items-center gap-2'>
        <Button
          variant='outlined'
          color='secondary'
          startIcon={<Icon icon='mdi:pencil-outline' fontSize={18} />}
          onClick={onEdit}
        >
          {t('recordActions.edit')}
        </Button>
        <Button
          variant='outlined'
          color='secondary'
          startIcon={<Icon icon={remove.icon} fontSize={18} />}
          onClick={onRemove}
        >
          {t(remove.labelKey)}
        </Button>
      </Box>
    </TopBarSlot>
  );
};

export default RecordHeaderActions;
