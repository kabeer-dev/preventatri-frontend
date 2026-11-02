import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import Icon from '@/@core/components/icon';
import useTranslation from '@/shared/hooks/useTranslation';
import {DataTableRowActionsProps} from '@/shared/interfaces/tables';

const DataTableRowActions = ({
  id,
  onEdit,
  onDelete,
  onVoid,
  onSkip,
  onResendInvitation,
  onCancelInvitation,
  showEdit = true,
  showDelete = true,
  showVoid = false,
  showSkip = false,
  skipLabel,
  showResendInvitation = false,
  showCancelInvitation = false,
  resendInvitationLabel,
  cancelInvitationLabel,
}: DataTableRowActionsProps) => {
  const {t} = useTranslation();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.({id});
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.({id});
  };

  const handleVoid = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVoid?.({id});
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSkip?.({id});
  };

  const handleResendInvitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResendInvitation?.();
  };

  const handleCancelInvitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancelInvitation?.();
  };

  const actionSlotSx = {
    width: 32,
    height: 32,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const canResendInvitation =
    showResendInvitation && Boolean(onResendInvitation);

  const canCancelInvitation =
    showCancelInvitation && Boolean(onCancelInvitation);

  const resendLabel =
    resendInvitationLabel ?? t('common.resendInvitation.action');

  const cancelLabel =
    cancelInvitationLabel ?? t('common.cancelInvitation.action');

  return (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
      {canResendInvitation && (
        <IconButton
          size='small'
          onClick={handleResendInvitation}
          sx={{...actionSlotSx, color: 'primary.main'}}
          aria-label={resendLabel}
          title={resendLabel}
        >
          <Icon icon='mdi:email-sync-outline' fontSize={20} />
        </IconButton>
      )}
      {canCancelInvitation && (
        <IconButton
          size='small'
          onClick={handleCancelInvitation}
          sx={{...actionSlotSx, color: 'warning.main'}}
          aria-label={cancelLabel}
          title={cancelLabel}
        >
          <Icon icon='mdi:email-remove-outline' fontSize={20} />
        </IconButton>
      )}
      {!canResendInvitation && !canCancelInvitation && (
        <Box aria-hidden='true' sx={actionSlotSx} />
      )}
      {showEdit && (
        <IconButton
          size='small'
          onClick={handleEdit}
          sx={{...actionSlotSx, color: 'text.secondary'}}
          aria-label='edit'
        >
          <Icon icon='mdi:pencil-outline' fontSize={20} />
        </IconButton>
      )}
      {showDelete && (
        <IconButton
          size='small'
          onClick={handleDelete}
          sx={{...actionSlotSx, color: 'text.secondary'}}
          aria-label='archive'
        >
          <Icon icon='mdi:archive-outline' fontSize={20} />
        </IconButton>
      )}
      {showSkip && (
        <IconButton
          size='small'
          onClick={handleSkip}
          sx={{...actionSlotSx, color: 'text.secondary'}}
          aria-label={skipLabel}
          title={skipLabel}
        >
          <Icon icon='mdi:skip-next-outline' fontSize={20} />
        </IconButton>
      )}
      {showVoid && (
        <IconButton
          size='small'
          onClick={handleVoid}
          sx={{...actionSlotSx, color: 'warning.main'}}
          aria-label='void'
        >
          <Icon icon='mdi:cancel' fontSize={20} />
        </IconButton>
      )}
    </Box>
  );
};

export default DataTableRowActions;
