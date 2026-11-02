'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {ConfirmationModal} from '@/shared/components/common/modals';
import {HHA_SYNC_EMAIL_MAX_LENGTH} from '@/shared/constants/hhaSyncHistory';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncChangeEmailModalProps} from '@/shared/interfaces/hhaSyncHistory';
import {hhaExchangeMutations} from '@/shared/reactQuery';
import {commonSchema} from '@/shared/schemas/commonSchemaCreator';

const KEY = 'hhaSyncHistory.emails.dialog';

// Gives one person of a shared address their own login email. The parent
// remounts it on open (key) so the field resets.
const HhaSyncChangeEmailModal = ({
  target,
  isOpen,
  onClose,
}: HhaSyncChangeEmailModalProps) => {
  const {t} = useTranslation();

  const {
    useUpdateHhaEmailConflictUserMutation,
    useUpdateHhaPendingImportEmailMutation,
  } = hhaExchangeMutations();

  const userMutation = useUpdateHhaEmailConflictUserMutation();
  const pendingMutation = useUpdateHhaPendingImportEmailMutation();
  const isPending = userMutation.isPending || pendingMutation.isPending;

  const [email, setEmail] = useState('');

  if (!target) return null;

  const trimmed = email.trim();
  const {pendingId} = target.member;

  const isValid = commonSchema(t)
    .email({fieldName: t(`${KEY}.emailLabel`)})
    .safeParse(trimmed).success;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      title={t(`${KEY}.title`)}
      confirmLabel={t(`${KEY}.save`)}
      dismissLabel={t(`${KEY}.cancel`)}
      confirmButtonColor='primary'
      onCancel={onClose}
      onConfirm={() => {
        const request = {
          payload: {email: trimmed},
          callBackFuncs: {onSuccess: onClose},
        };

        // Not imported yet: the email is saved for the next sync to use.
        if (pendingId) {
          pendingMutation.mutate({...request, params: {id: pendingId}});

          return;
        }

        userMutation.mutate({
          ...request,
          params: {userId: target.member.userId},
        });
      }}
      confirmLoading={isPending}
      disableConfirm={!isValid}
      maxWidth='sm'
      content={
        <Box className='flex flex-col gap-3'>
          <Typography variant='body2' sx={{color: 'text.secondary'}}>
            {t(`${KEY}.${pendingId ? 'pendingMessage' : 'message'}`, {
              name: target.member.name,
              email: target.sharedEmail,
            })}
          </Typography>
          <TextField
            autoFocus
            required
            fullWidth
            type='email'
            label={t(`${KEY}.emailLabel`)}
            placeholder={t(`${KEY}.emailPlaceholder`)}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isPending}
            error={Boolean(trimmed) && !isValid}
            helperText={
              trimmed && !isValid ? t(`${KEY}.invalidEmail`) : undefined
            }
            slotProps={{htmlInput: {maxLength: HHA_SYNC_EMAIL_MAX_LENGTH}}}
          />
        </Box>
      }
    />
  );
};

export default HhaSyncChangeEmailModal;
