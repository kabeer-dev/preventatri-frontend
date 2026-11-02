'use client';

import {useState} from 'react';

import {FormDrawer} from '@/shared/components/common/modals';
import {SYSTEM_ROLES} from '@/shared/constants/common';
import {
  INVITE_USER_FORM_ID,
  ORG_USER_ROLE_TABS,
} from '@/shared/constants/orgUsers';
import useTranslation from '@/shared/hooks/useTranslation';
import {InviteUserModalProps} from '@/shared/interfaces/orgUser';
import {userMutations} from '@/shared/reactQuery';
import {CaregiverFormValues} from '@/shared/types/caregiver';
import {CaseManagerFormValues} from '@/shared/types/caseManager';
import {NurseFormValues} from '@/shared/types/nurse';
import {buildCaregiverInvitePayload} from '@/shared/utils/caregiverUtils';
import {buildCaseManagerInvitePayload} from '@/shared/utils/caseManagerUtils';
import CaregiverModal from '@/views/pages/caregivers/CaregiverModal';
import CaseManagerModal from '@/views/pages/caseManagers/CaseManagerModal';
import NurseModal from '@/views/pages/nurses/NurseModal';

import InviteRoleSelector from './InviteRoleSelector';

/**
 * The single "Invite a user" drawer.
 *
 * One drawer for every role: switching role swaps only the embedded form, so
 * the drawer never closes and reopens. Each form is the one used to edit that
 * role, so fields and validation live in one place.
 */
const InviteUserModal = ({
  isOpen,
  onClose,
  initialRole,
}: InviteUserModalProps) => {
  const {t} = useTranslation();

  const defaultRole = initialRole ?? ORG_USER_ROLE_TABS[0].value;

  const [role, setRole] = useState<string>(defaultRole);
  const [isDirty, setIsDirty] = useState(false);
  const [wasOpen, setWasOpen] = useState(isOpen);

  // Stays mounted so the drawer can animate; each open starts on the caller's role.
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);

    if (isOpen) {
      setRole(defaultRole);
      setIsDirty(false);
    }
  }

  const {useInviteUserMutation} = userMutations();

  const {mutate: inviteUser, isPending} = useInviteUserMutation({
    userType: role,
  });

  const formProps = {
    isOpen: true,
    embedded: true,
    formId: INVITE_USER_FORM_ID,
    onClose,
    isLoading: isPending,
    onDirtyChange: ({isDirty: next}: {isDirty: boolean}) => setIsDirty(next),
  };

  return (
    <FormDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={t('orgUsers.invite.title')}
      subtitle={t('orgUsers.invite.subtitle')}
      formId={INVITE_USER_FORM_ID}
      isLoading={isPending}
      isDirty={isDirty}
    >
      <InviteRoleSelector
        role={role}
        onChange={({role: next}) => setRole(next)}
        disabled={isPending}
      />

      {role === SYSTEM_ROLES.nurse.value && (
        <NurseModal
          isOpen={formProps.isOpen}
          embedded={formProps.embedded}
          formId={formProps.formId}
          onClose={formProps.onClose}
          isLoading={formProps.isLoading}
          onDirtyChange={formProps.onDirtyChange}
          nurse={null}

          // The nurse form already emits the invite shape; the other two roles
          // are mapped by their own payload builders.
          onSubmit={(payload: NurseFormValues) =>
            inviteUser({payload, callBackFuncs: {onSuccess: onClose}})
          }
        />
      )}

      {role === SYSTEM_ROLES.caregiver.value && (
        <CaregiverModal
          isOpen={formProps.isOpen}
          embedded={formProps.embedded}
          formId={formProps.formId}
          onClose={formProps.onClose}
          isLoading={formProps.isLoading}
          onDirtyChange={formProps.onDirtyChange}
          caregiver={null}
          onSubmit={(data: CaregiverFormValues) =>
            inviteUser({
              payload: buildCaregiverInvitePayload({data}),
              callBackFuncs: {onSuccess: onClose},
            })
          }
        />
      )}

      {role === SYSTEM_ROLES.caseManager.value && (
        <CaseManagerModal
          isOpen={formProps.isOpen}
          embedded={formProps.embedded}
          formId={formProps.formId}
          onClose={formProps.onClose}
          isLoading={formProps.isLoading}
          onDirtyChange={formProps.onDirtyChange}
          caseManager={null}
          onSubmit={(data: CaseManagerFormValues) =>
            inviteUser({
              payload: buildCaseManagerInvitePayload({data}),
              callBackFuncs: {onSuccess: onClose},
            })
          }
        />
      )}
    </FormDrawer>
  );
};

export default InviteUserModal;
