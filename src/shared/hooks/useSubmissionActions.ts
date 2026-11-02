'use client';

import {useState} from 'react';

import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import {useModal} from '@/shared/hooks/modals/useModal';
import {SubmissionActionTarget} from '@/shared/interfaces/submission';
import {assessmentMutations, followUpTaskMutations} from '@/shared/reactQuery';
import {FollowUpFormPayload} from '@/shared/types/followUp';
import {buildFollowUpPayload} from '@/shared/utils/followUpUtils';

import {useOrganizationTimeZone} from './useOrganizationTimeZone';

// Skip, void and follow-up actions on one submission, shared by the list and
// the detail page.
export const useSubmissionActions = () => {
  const {zone} = useOrganizationTimeZone();
  const voidModal = useModal();
  const skipModal = useModal();
  const followUpModal = useModal();
  const [target, setTarget] = useState<SubmissionActionTarget | null>(null);

  const {useVoidSubmissionMutation, useSkipSubmissionMutation} =
    assessmentMutations();

  const {useCreateFollowUpTaskMutation} = followUpTaskMutations();
  const voidMutation = useVoidSubmissionMutation();
  const skipMutation = useSkipSubmissionMutation();
  const createFollowUp = useCreateFollowUpTaskMutation();

  const closeAll = () => {
    voidModal.closeModal();
    skipModal.closeModal();
    followUpModal.closeModal();
    setTimeout(() => setTarget(null), POST_MODAL_CLEANUP_DELAY);
  };

  const openWith =
    ({openModal}: {openModal: () => void}) =>
    ({submission}: {submission: SubmissionActionTarget}) => {
      setTarget(submission);
      openModal();
    };

  const confirmVoid = ({reason}: {reason: string}) => {
    if (!target) return;

    voidMutation.mutate({
      params: {id: target.id},
      payload: {voidReason: reason},
      callBackFuncs: {onSuccess: closeAll},
    });
  };

  const confirmSkip = ({reason}: {reason: string}) => {
    if (!target) return;

    skipMutation.mutate({
      params: {id: target.id},
      payload: {reason},
      callBackFuncs: {onSuccess: closeAll},
    });
  };

  const submitFollowUp = (values: FollowUpFormPayload) =>
    createFollowUp.mutate({
      payload: buildFollowUpPayload({values, zone}),
      callBackFuncs: {onSuccess: closeAll},
    });

  return {
    target,
    modals: {voidModal, skipModal, followUpModal},
    open: {
      void: openWith({openModal: voidModal.openModal}),
      skip: openWith({openModal: skipModal.openModal}),
      followUp: openWith({openModal: followUpModal.openModal}),
    },
    handlers: {closeAll, confirmVoid, confirmSkip, submitFollowUp},
    pending: {
      isVoiding: voidMutation.isPending,
      isSkipping: skipMutation.isPending,
      isCreatingFollowUp: createFollowUp.isPending,
    },
  };
};
