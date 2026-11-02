'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import BaseDialog from '@/shared/components/common/modals/BaseDialog';
import {ConfirmationModal} from '@/shared/components/common/modals/ConfirmationModal';
import useTranslation from '@/shared/hooks/useTranslation';
import {BulkInviteDialogsProps} from '@/shared/interfaces/orgUser';
import {getFullName} from '@/shared/utils/general';

/** The confirm step of a bulk invitation, then who was sent and who was not. */
const BulkInviteDialogs = ({
  selectedCount,
  isConfirmOpen,
  isSending,
  onCancel,
  onConfirm,
  summary,
  invitedUsers,
  onCloseSummary,
}: BulkInviteDialogsProps) => {
  const {t} = useTranslation();

  const skipped = (summary?.results ?? []).filter((result) => !result.sent);

  const nameOf = ({userId}: {userId: string}) => {
    const user = invitedUsers.find((row) => row.userId === userId);

    return user ? getFullName(user) || user.email : userId;
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        title={t('orgUsers.bulkInvite.title')}
        content={t('orgUsers.bulkInvite.message', {count: selectedCount})}
        confirmLabel={t('orgUsers.bulkInvite.confirmLabel')}
        dismissLabel={t('orgUsers.bulkInvite.cancelLabel')}
        onCancel={onCancel}
        onConfirm={onConfirm}
        confirmLoading={isSending}
        confirmButtonColor='primary'
      />

      <BaseDialog
        isOpen={Boolean(summary)}
        onClose={onCloseSummary}
        maxWidth='xs'
      >
        <DialogTitle sx={{pr: 16}}>
          {t('orgUsers.bulkInvite.resultTitle')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('orgUsers.bulkInvite.resultSummary', {
              sent: summary?.sentCount ?? 0,
              skipped: summary?.skippedCount ?? 0,
            })}
          </Typography>

          {skipped.length > 0 && (
            <Box sx={{mt: 4, display: 'flex', flexDirection: 'column', gap: 2}}>
              <Typography variant='subtitle2'>
                {t('orgUsers.bulkInvite.skippedHeading')}
              </Typography>

              {skipped.map((result) => (
                <Box key={result.userId}>
                  <Typography variant='body2'>
                    {nameOf({userId: result.userId})}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {t(`orgUsers.bulkInvite.reasons.${result.reason}`)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions className='dialog-actions-dense pb-4'>
          <Button variant='contained' onClick={onCloseSummary}>
            {t('orgUsers.bulkInvite.close')}
          </Button>
        </DialogActions>
      </BaseDialog>
    </>
  );
};

export default BulkInviteDialogs;
