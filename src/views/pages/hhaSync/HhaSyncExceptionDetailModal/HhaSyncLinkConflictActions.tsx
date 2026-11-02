'use client';

import {useState} from 'react';

import Button from '@mui/material/Button';

import {ConfirmationModal} from '@/shared/components/common/modals/ConfirmationModal';
import {
  HHA_LINK_CONFLICT_CHOICE,
  HHA_SYNC_LINK_CONFLICTS,
  HHA_SYNC_NURSE_CONFLICT_TYPE,
} from '@/shared/constants/hhaSyncHistory';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncExceptionActionsProps} from '@/shared/interfaces/hhaSyncHistory';
import {hhaExchangeMutations} from '@/shared/reactQuery';

const KEY = 'hhaSyncHistory.exceptions.conflicts';

// The only way to close a nurse or case manager conflict: keep who is on the
// patient, or take HHAeXchange's person.
const HhaSyncLinkConflictActions = ({
  exception,
  onDone,
}: HhaSyncExceptionActionsProps) => {
  const {t} = useTranslation();
  const [pendingChoice, setPendingChoice] = useState<string | null>(null);

  const {
    useSelectHhaPatientPrimaryNurseMutation,
    useSettleHhaPatientCaseManagerConflictMutation,
  } = hhaExchangeMutations();

  const nurseMutation = useSelectHhaPatientPrimaryNurseMutation();
  const caseManagerMutation = useSettleHhaPatientCaseManagerConflictMutation();

  const {mutate: settle, isPending} =
    exception.type === HHA_SYNC_NURSE_CONFLICT_TYPE
      ? nurseMutation
      : caseManagerMutation;

  const conflict = HHA_SYNC_LINK_CONFLICTS[exception.type];
  const patientId = exception.record?.id;

  if (!patientId || !conflict) return null;

  const copyKey = `${KEY}.${conflict.copyKey}`;
  const isKeep = pendingChoice === HHA_LINK_CONFLICT_CHOICE.preventatri;
  const unknown = t(`${copyKey}.unknown`);

  const names = {
    current: exception[conflict.holderField]?.name || unknown,
    hha: exception.relatedUser?.name || unknown,
  };

  const confirm = () => {
    if (!pendingChoice) return;

    settle({
      params: {patientId},
      payload: {choice: pendingChoice},
      callBackFuncs: {
        onSuccess: onDone,
        onError: () => setPendingChoice(null),
      },
    });
  };

  return (
    <>
      <Button
        variant='outlined'
        color='secondary'
        disabled={isPending}
        onClick={() => setPendingChoice(HHA_LINK_CONFLICT_CHOICE.preventatri)}
      >
        {t(`${copyKey}.keep`)}
      </Button>
      <Button
        variant='contained'
        disabled={isPending}
        onClick={() => setPendingChoice(HHA_LINK_CONFLICT_CHOICE.hha)}
      >
        {t(`${copyKey}.use`)}
      </Button>

      <ConfirmationModal
        isOpen={Boolean(pendingChoice)}
        title={t(`${copyKey}.${isKeep ? 'keepTitle' : 'useTitle'}`)}
        content={t(
          `${copyKey}.${isKeep ? 'keepMessage' : 'useMessage'}`,
          names
        )}
        confirmLabel={t(`${copyKey}.${isKeep ? 'keep' : 'use'}`)}
        confirmButtonColor='primary'
        confirmLoading={isPending}
        onConfirm={confirm}
        onCancel={() => setPendingChoice(null)}
      />
    </>
  );
};

export default HhaSyncLinkConflictActions;
