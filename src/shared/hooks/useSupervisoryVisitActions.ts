'use client';

import {
  SUPERVISORY_VISIT_EVIDENCE_FIELD,
  SUPERVISORY_VISIT_FOLLOW_UPS_FIELD,
} from '@/shared/constants/supervisoryVisits';
import {useModal} from '@/shared/hooks/modals/useModal';
import {
  QueuedFollowUp,
  SupervisoryVisit,
} from '@/shared/interfaces/supervisoryVisit';
import {supervisoryVisitMutations} from '@/shared/reactQuery';
import {
  SupervisoryVisitCompleteFormValues,
  SupervisoryVisitFormPayload,
} from '@/shared/types/supervisoryVisit';
import {buildSupervisoryVisitUpdatePayload} from '@/shared/utils/supervisoryVisitUtils';
import {appendCompletionFormFields} from '@/shared/utils/workItemUtils';

import {useOrganizationTimeZone} from './useOrganizationTimeZone';

// The body the API expects per queued task: the visit supplies the patient.
const toQueuedFollowUpBody = ({queued}: {queued: QueuedFollowUp}) => ({
  title: queued.payload.title,
  description: queued.payload.description,
  priority: queued.payload.priority,
  dueAt: queued.payload.dueAt,
  assigneeUserOrganizationId: queued.payload.assigneeUserOrganizationId,
  checklistTemplateId: queued.payload.checklistTemplateId || undefined,
});

// Every mutation the visit pages can fire, plus the modal each one opens
// from, so the page containers only compose.
export const useSupervisoryVisitActions = ({
  id,
  onFiled,
}: {
  id: string;

  /** Runs after a successful filing, e.g. to leave the checklist run. */
  onFiled?: () => void;
}) => {
  const {
    useUpdateSupervisoryVisitMutation,
    useCancelSupervisoryVisitMutation,

    // PREVENT-772: reopen removed for now; uncomment to restore.
    // useReopenSupervisoryVisitMutation,
    useCompleteSupervisoryVisitMutation,
    useApproveSupervisoryVisitMutation,
    useRequestSupervisoryVisitCorrectionMutation,
  } = supervisoryVisitMutations();

  const update = useUpdateSupervisoryVisitMutation();
  const cancel = useCancelSupervisoryVisitMutation();

  // const reopen = useReopenSupervisoryVisitMutation();
  const complete = useCompleteSupervisoryVisitMutation();
  const approve = useApproveSupervisoryVisitMutation();
  const requestCorrection = useRequestSupervisoryVisitCorrectionMutation();
  const {zone} = useOrganizationTimeZone();

  const editModal = useModal();
  const completeModal = useModal();
  const cancelModal = useModal();

  // const reopenModal = useModal();
  const approveModal = useModal();
  const correctionModal = useModal();
  const followUpModal = useModal();

  // Only what changed travels, so an untouched past window is not re-validated.
  const submitEdit = ({
    values,
    visit,
  }: {
    values: SupervisoryVisitFormPayload;
    visit: SupervisoryVisit;
  }) =>
    update.mutate({
      params: {id},
      payload: buildSupervisoryVisitUpdatePayload({values, visit, zone}),
      callBackFuncs: {onSuccess: () => editModal.closeModal()},
    });

  const submitCancel = ({reason}: {reason: string}) =>
    cancel.mutate({
      params: {id},
      payload: {reason},
      callBackFuncs: {onSuccess: () => cancelModal.closeModal()},
    });

  // const confirmReopen = () =>
  //   reopen.mutate({
  //     params: {id},
  //     payload: {},
  //     callBackFuncs: {onSuccess: () => reopenModal.closeModal()},
  //   });

  const submitApprove = ({reason}: {reason: string}) =>
    approve.mutate({
      params: {id},
      payload: {note: reason || null},
      callBackFuncs: {onSuccess: () => approveModal.closeModal()},
    });

  const submitCorrection = ({reason}: {reason: string}) =>
    requestCorrection.mutate({
      params: {id},
      payload: {reason},
      callBackFuncs: {onSuccess: () => correctionModal.closeModal()},
    });

  // The runner passes its answers in; the drawer adds outcome, findings,
  // evidence and the follow-up tasks queued along the way.
  const submitComplete = ({
    values,
    files,
    queuedFollowUps,
    formData = new FormData(),
  }: {
    values: SupervisoryVisitCompleteFormValues;
    files: File[];
    queuedFollowUps: QueuedFollowUp[];
    formData?: FormData;
  }) => {
    appendCompletionFormFields({
      formData,
      values,
      files,
      evidenceField: SUPERVISORY_VISIT_EVIDENCE_FIELD,
    });

    if (queuedFollowUps.length)
      formData.append(
        SUPERVISORY_VISIT_FOLLOW_UPS_FIELD,
        JSON.stringify(
          queuedFollowUps.map((queued) => toQueuedFollowUpBody({queued}))
        )
      );

    complete.mutate({
      params: {id},
      payload: formData,
      callBackFuncs: {
        onSuccess: () => {
          completeModal.closeModal();
          onFiled?.();
        },
      },
    });
  };

  return {
    modals: {
      editModal,
      completeModal,
      cancelModal,

      // reopenModal,
      approveModal,
      correctionModal,
      followUpModal,
    },
    handlers: {
      onEdit: editModal.openModal,
      onCancel: cancelModal.openModal,
      onFile: completeModal.openModal,

      // onReopen: reopenModal.openModal,
      onApprove: approveModal.openModal,
      onRequestCorrection: correctionModal.openModal,
      onAddFollowUp: followUpModal.openModal,
      submitEdit,
      submitCancel,

      // confirmReopen,
      submitApprove,
      submitCorrection,
      submitComplete,
    },
    pending: {
      isUpdating: update.isPending,
      isCancelling: cancel.isPending,

      // isReopening: reopen.isPending,
      isCompleting: complete.isPending,
      isApproving: approve.isPending,
      isRequestingCorrection: requestCorrection.isPending,
    },
  };
};
