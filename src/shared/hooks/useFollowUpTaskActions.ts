'use client';

import {FOLLOW_UP_COMPLETE_EVIDENCE_FIELD} from '@/shared/constants/followUps';
import {useModal} from '@/shared/hooks/modals/useModal';
import {FollowUpTask} from '@/shared/interfaces/followUp';
import {followUpTaskMutations} from '@/shared/reactQuery';
import {
  FollowUpCancelFormValues,
  FollowUpCompleteFormValues,
  FollowUpFormPayload,
} from '@/shared/types/followUp';
import {buildFollowUpUpdatePayload} from '@/shared/utils/followUpUtils';

import {useOrganizationTimeZone} from './useOrganizationTimeZone';

// Every mutation the detail page can fire, plus the modal each one opens
// from, so the page container only composes.
export const useFollowUpTaskActions = ({
  id,
  onCompleted,
}: {
  id: string;

  /** Runs after a successful completion, e.g. to leave the checklist run. */
  onCompleted?: () => void;
}) => {
  const {
    useUpdateFollowUpTaskMutation,
    useCancelFollowUpTaskMutation,

    // PREVENT-772: reopen removed for now; uncomment to restore.
    // useReopenFollowUpTaskMutation,
    useCompleteFollowUpTaskMutation,
  } = followUpTaskMutations();

  const update = useUpdateFollowUpTaskMutation();
  const cancel = useCancelFollowUpTaskMutation();

  // const reopen = useReopenFollowUpTaskMutation();
  const complete = useCompleteFollowUpTaskMutation();
  const {zone} = useOrganizationTimeZone();

  const editModal = useModal();
  const completeModal = useModal();
  const cancelModal = useModal();

  // const reopenModal = useModal();

  // Only what changed travels, so an untouched past due date is not re-validated.
  const submitEdit = ({
    values,
    task,
  }: {
    values: FollowUpFormPayload;
    task: FollowUpTask;
  }) =>
    update.mutate({
      params: {id},
      payload: buildFollowUpUpdatePayload({values, task, zone}),
      callBackFuncs: {onSuccess: () => editModal.closeModal()},
    });

  const submitCancel = ({values}: {values: FollowUpCancelFormValues}) =>
    cancel.mutate({
      params: {id},
      payload: values,
      callBackFuncs: {onSuccess: () => cancelModal.closeModal()},
    });

  // const confirmReopen = () =>
  //   reopen.mutate({
  //     params: {id},
  //     payload: {},
  //     callBackFuncs: {onSuccess: () => reopenModal.closeModal()},
  //   });

  // A checklist task passes its answers in; the drawer adds outcome, notes, evidence.
  const submitComplete = ({
    values,
    files,
    formData = new FormData(),
  }: {
    values: FollowUpCompleteFormValues;
    files: File[];
    formData?: FormData;
  }) => {
    formData.append('outcome', values.outcome);
    formData.append('completionNotes', values.completionNotes);
    files.forEach((file) =>
      formData.append(FOLLOW_UP_COMPLETE_EVIDENCE_FIELD, file)
    );

    complete.mutate({
      params: {id},
      payload: formData,
      callBackFuncs: {
        onSuccess: () => {
          completeModal.closeModal();
          onCompleted?.();
        },
      },
    });
  };

  return {
    // modals: {editModal, completeModal, cancelModal, reopenModal},
    modals: {editModal, completeModal, cancelModal},
    handlers: {
      onEdit: editModal.openModal,
      onCancel: cancelModal.openModal,
      onComplete: completeModal.openModal,

      // onReopen: reopenModal.openModal,
      submitEdit,
      submitCancel,

      // confirmReopen,
      submitComplete,
    },
    pending: {
      isUpdating: update.isPending,
      isCancelling: cancel.isPending,

      // isReopening: reopen.isPending,
      isCompleting: complete.isPending,
    },
  };
};
