'use client';

import {useState} from 'react';

import RecordHeaderActions from '@/shared/components/common/headers/RecordHeaderActions';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import {UserRecordActionsProps} from '@/shared/interfaces/orgUser';
import DeleteUserDialog from '@/views/pages/users/DeleteUserDialog';
import EditUserModal from '@/views/pages/users/EditUserModal';

const UserRecordActions = ({user}: UserRecordActionsProps) => {
  const router = useLocaleRouter();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <RecordHeaderActions
        onEdit={() => setIsEditOpen(true)}
        onRemove={() => setIsDeleteOpen(true)}
        removeAction='delete'
      />

      {isEditOpen && (
        <EditUserModal user={user} onClose={() => setIsEditOpen(false)} />
      )}

      {isDeleteOpen && (
        <DeleteUserDialog
          user={user}
          onClose={() => setIsDeleteOpen(false)}
          onDeleted={() => router.push({url: DASHBOARD_ROUTES.users.all()})}
        />
      )}
    </>
  );
};

export default UserRecordActions;
