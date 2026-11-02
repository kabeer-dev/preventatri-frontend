'use client';

import {createElement, useState} from 'react';

import {ConfirmationModal} from '@/shared/components/common/modals/ConfirmationModal';
import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import {useModal} from '@/shared/hooks/modals/useModal';
import useTranslation from '@/shared/hooks/useTranslation';
import {CancelInvitationTarget} from '@/shared/interfaces/common';
import {userMutations} from '@/shared/reactQuery';
import {getFullName} from '@/shared/utils/general';

export const useCancelInvitationFlow = () => {
  const {t} = useTranslation();
  const {useRevokeInvitationMutation} = userMutations();

  const {mutate: revokeInvitation, isPending: isRevoking} =
    useRevokeInvitationMutation();

  const {isModalOpen, openModal, closeModal} = useModal();

  const [target, setTarget] = useState<CancelInvitationTarget | null>(null);

  const handleCancelInvitation = (next: CancelInvitationTarget) => {
    setTarget(next);
    openModal();
  };

  const dismiss = () => {
    closeModal();
    setTimeout(() => setTarget(null), POST_MODAL_CLEANUP_DELAY);
  };

  const confirm = () => {
    if (!target?.userId) return;

    revokeInvitation({
      payload: {userId: target.userId},
      callBackFuncs: {onSuccess: dismiss},
    });
  };

  // An element, not a component made here: a new component type per render
  // remounts the dialog, so it flickers and loses its fade.
  const cancelInvitationModal = createElement(ConfirmationModal, {
    isOpen: isModalOpen,
    title: t('common.cancelInvitation.title'),
    content: t('common.cancelInvitation.message', {
      name: getFullName({
        firstName: target?.firstName,
        lastName: target?.lastName,
      }),
    }),
    confirmLabel: t('common.cancelInvitation.confirmLabel'),
    dismissLabel: t('common.cancelInvitation.cancelLabel'),
    onCancel: dismiss,
    onConfirm: confirm,
    confirmLoading: isRevoking,
    confirmButtonColor: 'warning',
  });

  return {handleCancelInvitation, cancelInvitationModal};
};
