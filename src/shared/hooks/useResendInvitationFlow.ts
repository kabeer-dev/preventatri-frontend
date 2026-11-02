'use client';

import {createElement, useState} from 'react';

import {ConfirmationModal} from '@/shared/components/common/modals/ConfirmationModal';
import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import {useModal} from '@/shared/hooks/modals/useModal';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  ResendInvitationTarget,
  UseResendInvitationFlowParams,
} from '@/shared/interfaces/common';
import {userMutations} from '@/shared/reactQuery';

export const useResendInvitationFlow = ({
  onSent,
}: UseResendInvitationFlowParams = {}) => {
  const {t} = useTranslation();
  const {useResendInvitationMutation} = userMutations();

  const {mutate: resendInvitation, isPending: isResending} =
    useResendInvitationMutation();

  const {isModalOpen, openModal, closeModal} = useModal();

  const [target, setTarget] = useState<ResendInvitationTarget | null>(null);

  const handleResendInvitation = (next: ResendInvitationTarget) => {
    setTarget(next);
    openModal();
  };

  const cancelResend = () => {
    closeModal();
    setTimeout(() => setTarget(null), POST_MODAL_CLEANUP_DELAY);
  };

  const confirmResend = () => {
    if (!target?.email) return;
    resendInvitation({
      payload: {email: target.email},
      callBackFuncs: {
        onSuccess: () => {
          cancelResend();
          onSent?.();
        },
      },
    });
  };

  const displayName = target
    ? `${target.firstName ?? ''} ${target.lastName ?? ''}`.trim()
    : '';

  const copyKey = target?.isFirstInvitation
    ? 'common.sendInvitation'
    : 'common.resendInvitation';

  // An element, not a component made here: a new component type per render
  // remounts the dialog, so it flickers and loses its fade.
  const resendInvitationModal = createElement(ConfirmationModal, {
    isOpen: isModalOpen,
    title: t(`${copyKey}.title`),
    content: t(`${copyKey}.message`, {name: displayName}),
    confirmLabel: t(`${copyKey}.confirmLabel`),
    dismissLabel: t('common.resendInvitation.cancelLabel'),
    onCancel: cancelResend,
    onConfirm: confirmResend,
    confirmLoading: isResending,
    confirmButtonColor: 'primary',
  });

  return {handleResendInvitation, resendInvitationModal};
};
