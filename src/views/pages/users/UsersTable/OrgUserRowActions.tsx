import DataTableRowActions from '@/shared/components/common/table/DataTableRowActions';
import {
  ORG_USER_INVITABLE_STATUSES,
  ORG_USER_INVITATION_STATUS,
} from '@/shared/constants/orgUsers';
import useTranslation from '@/shared/hooks/useTranslation';
import {OrgUserRowActionsProps} from '@/shared/interfaces/orgUser';

/** One roster row's actions; the invitation ones follow its invitation status. */
const OrgUserRowActions = ({
  row,
  onEdit,
  onDelete,
  onResendInvitation,
  onCancelInvitation,
}: OrgUserRowActionsProps) => {
  const {t} = useTranslation();

  // An archived person can be opened but not changed.
  if (row.archived) return null;

  const isFirstInvitation =
    row.invitationStatus === ORG_USER_INVITATION_STATUS.READY_TO_INVITE.value;

  const name = {
    firstName: row.firstName ?? '',
    lastName: row.lastName ?? '',
  };

  return (
    <DataTableRowActions
      id={row.id}
      onEdit={onEdit}
      onDelete={onDelete}
      onResendInvitation={() =>
        onResendInvitation?.({
          ...name,
          email: row.email ?? '',
          isFirstInvitation,
        })
      }
      onCancelInvitation={() =>
        onCancelInvitation?.({...name, userId: row.userId ?? ''})
      }
      showResendInvitation={ORG_USER_INVITABLE_STATUSES.includes(
        row.invitationStatus
      )}
      showCancelInvitation={
        row.invitationStatus === ORG_USER_INVITATION_STATUS.INVITED.value
      }
      resendInvitationLabel={
        isFirstInvitation ? t('common.sendInvitation.action') : undefined
      }
    />
  );
};

export default OrgUserRowActions;
