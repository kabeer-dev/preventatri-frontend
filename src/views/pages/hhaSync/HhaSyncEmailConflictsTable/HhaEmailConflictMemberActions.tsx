'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {HHA_EMAIL_ADMIN_SET_STATE} from '@/shared/constants/hhaSyncHistory';
import {
  ORG_USER_INVITABLE_STATUSES,
  ORG_USER_INVITATION_STATUS,
} from '@/shared/constants/orgUsers';
import {useResendInvitationFlow} from '@/shared/hooks/useResendInvitationFlow';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaEmailConflictMemberActionsProps} from '@/shared/interfaces/hhaSyncHistory';

// Invite someone once an admin gave them their own email; change it until they accept.
const HhaEmailConflictMemberActions = ({
  member,
  sharedEmail,
  onChangeEmail,
}: HhaEmailConflictMemberActionsProps) => {
  const {t} = useTranslation();

  const {handleResendInvitation, resendInvitationModal} =
    useResendInvitationFlow();

  const isInvitable =
    member.state === HHA_EMAIL_ADMIN_SET_STATE &&
    ORG_USER_INVITABLE_STATUSES.includes(member.invitationStatus || '');

  const isFirstInvitation =
    member.invitationStatus ===
    ORG_USER_INVITATION_STATUS.READY_TO_INVITE.value;

  return (
    <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
      {isInvitable && (
        <Button
          size='small'
          variant='contained'
          onClick={() =>
            handleResendInvitation({
              email: member.loginEmail || '',
              firstName: member.name,
              isFirstInvitation,
            })
          }
        >
          {t(
            isFirstInvitation
              ? 'common.sendInvitation.action'
              : 'common.resendInvitation.action'
          )}
        </Button>
      )}

      {member.isEditable && (
        <Button
          size='small'
          variant='outlined'
          onClick={() => onChangeEmail({member, sharedEmail})}
        >
          {t('hhaSyncHistory.emails.changeEmail')}
        </Button>
      )}

      {isInvitable && resendInvitationModal}
    </Box>
  );
};

export default HhaEmailConflictMemberActions;
