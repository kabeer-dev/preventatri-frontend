'use client';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  HHA_SYNC_INVITE_BLOCKED_FALLBACK_KEY,
  HHA_SYNC_INVITE_BLOCKED_KEYS,
} from '@/shared/constants/hhaSyncHistory';
import {
  ORG_USER_INVITABLE_STATUSES,
  ORG_USER_INVITATION_STATUS,
} from '@/shared/constants/orgUsers';
import {useResendInvitationFlow} from '@/shared/hooks/useResendInvitationFlow';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncExceptionActionsProps} from '@/shared/interfaces/hhaSyncHistory';

const KEY = 'hhaSyncHistory.exceptions.invite';

// Invite the person the exception names, or say why they cannot be invited yet.
const HhaSyncInviteAction = ({
  exception,
  onDone,
}: HhaSyncExceptionActionsProps) => {
  const {t} = useTranslation();

  const {handleResendInvitation, resendInvitationModal} =
    useResendInvitationFlow({onSent: onDone});

  const {relatedUser, invitationStatus} = exception;

  if (!relatedUser || !invitationStatus) return null;

  if (!ORG_USER_INVITABLE_STATUSES.includes(invitationStatus)) {
    return (
      <Typography variant='small' className='text-ink-soft self-center'>
        {t(
          `${KEY}.blocked.${
            HHA_SYNC_INVITE_BLOCKED_KEYS[invitationStatus] ||
            HHA_SYNC_INVITE_BLOCKED_FALLBACK_KEY
          }`
        )}
      </Typography>
    );
  }

  const isFirstInvitation =
    invitationStatus === ORG_USER_INVITATION_STATUS.READY_TO_INVITE.value;

  return (
    <>
      <Button
        variant='contained'
        onClick={() =>
          handleResendInvitation({
            email: relatedUser.email,
            firstName: relatedUser.name,
            isFirstInvitation,
          })
        }
      >
        {t(`${KEY}.${isFirstInvitation ? 'send' : 'resend'}`)}
      </Button>
      {resendInvitationModal}
    </>
  );
};

export default HhaSyncInviteAction;
