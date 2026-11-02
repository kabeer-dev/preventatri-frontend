'use client';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import Icon from '@/@core/components/icon';
import useTranslation from '@/shared/hooks/useTranslation';
import {PatientTableRowActionsProps} from '@/shared/interfaces/patient';

const PatientTableRowActions = ({
  id,
  onEdit,
  onCareTeam,
  onDelete,
  showEdit = true,
  showDelete = true,
  isEditLoading = false,
  isCareTeamLoading = false,
}: PatientTableRowActionsProps) => {
  const {t} = useTranslation();

  // Both buttons open the same drawer, so neither is offered while the record
  // is loading for the other.
  const isDrawerLoading = isEditLoading || isCareTeamLoading;

  // The care team button sits in a span so its tooltip still shows while the
  // button itself is disabled.
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.({id});
  };

  const handleCareTeam = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCareTeam?.({id});
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.({id});
  };

  return (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
      {showEdit && (
        <IconButton
          size='small'
          onClick={handleEdit}
          disabled={isDrawerLoading}
          sx={{color: 'text.secondary'}}
          aria-label='edit'
        >
          {isEditLoading ? (
            <CircularProgress size={20} color='inherit' />
          ) : (
            <Icon icon='mdi:pencil-outline' fontSize={20} />
          )}
        </IconButton>
      )}
      {showEdit && onCareTeam && (
        <Tooltip title={t('patients.table.editCareTeam')}>
          <span>
            <IconButton
              size='small'
              onClick={handleCareTeam}
              disabled={isDrawerLoading}
              sx={{color: 'text.secondary'}}
              aria-label={t('patients.table.editCareTeam')}
            >
              {isCareTeamLoading ? (
                <CircularProgress size={20} color='inherit' />
              ) : (
                <Icon icon='mdi:doctor' fontSize={20} />
              )}
            </IconButton>
          </span>
        </Tooltip>
      )}
      {showDelete && (
        <IconButton
          size='small'
          onClick={handleDelete}
          sx={{color: 'text.secondary'}}
          aria-label='archive'
        >
          <Icon icon='mdi:archive-outline' fontSize={20} />
        </IconButton>
      )}
    </Box>
  );
};

export default PatientTableRowActions;
