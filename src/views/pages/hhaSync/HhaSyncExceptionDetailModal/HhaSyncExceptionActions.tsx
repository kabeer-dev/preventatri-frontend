'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Link from '@/shared/components/common/localeLink';
import ReasonDialog from '@/shared/components/common/modals/ReasonDialog';
import {
  HHA_SYNC_COUNTY_NOT_SET_UP_TYPE,
  HHA_SYNC_EXCEPTION_ADMIN_STATUS,
  HHA_SYNC_FIX_TARGETS,
  HHA_SYNC_INVITATION_PENDING_TYPES,
  HHA_SYNC_LINK_CONFLICTS,
  HHA_SYNC_NOTE_MAX_LENGTH,
} from '@/shared/constants/hhaSyncHistory';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncExceptionActionsProps} from '@/shared/interfaces/hhaSyncHistory';
import {hhaExchangeMutations} from '@/shared/reactQuery';
import {
  getExceptionTypeMeta,
  resolveRecordHref,
} from '@/shared/utils/hhaSyncHistoryUtils';

import HhaSyncAddCountyAction from './HhaSyncAddCountyAction';
import HhaSyncInviteAction from './HhaSyncInviteAction';
import HhaSyncLinkConflictActions from './HhaSyncLinkConflictActions';

const KEY = 'hhaSyncHistory.exceptions';

// "Open in PreventaTri", plus Resolve/Dismiss on an open exception or Reopen otherwise.
const HhaSyncExceptionActions = ({
  exception,
  onDone,
}: HhaSyncExceptionActionsProps) => {
  const {t} = useTranslation();
  const {useUpdateHhaSyncExceptionMutation} = hhaExchangeMutations();

  const {mutate: updateException, isPending} =
    useUpdateHhaSyncExceptionMutation();

  const [noteStatus, setNoteStatus] = useState<string | null>(null);

  const {fixTarget} = getExceptionTypeMeta({type: exception.type});

  const fixHref =
    fixTarget === HHA_SYNC_FIX_TARGETS.relatedUser
      ? resolveRecordHref({record: exception.relatedUser?.profile || null})
      : fixTarget === HHA_SYNC_FIX_TARGETS.record
        ? resolveRecordHref({record: exception.record})
        : null;

  const isOpen = exception.status === HHA_SYNC_EXCEPTION_ADMIN_STATUS.open;
  const isLinkConflict = Boolean(HHA_SYNC_LINK_CONFLICTS[exception.type]);

  const isInvitationPending = HHA_SYNC_INVITATION_PENDING_TYPES.includes(
    exception.type
  );

  const isCountyNotSetUp =
    exception.type === HHA_SYNC_COUNTY_NOT_SET_UP_TYPE &&
    Boolean(exception.detail);

  const submit = ({status, note}: {status: string; note?: string}) =>
    updateException({
      params: {id: exception.id},
      payload: {status, note: note || null},
      callBackFuncs: {
        onSuccess: () => {
          setNoteStatus(null);
          onDone();
        },
      },
    });

  const isResolve = noteStatus === HHA_SYNC_EXCEPTION_ADMIN_STATUS.resolved;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'flex-end',
      }}
    >
      {fixHref && (
        <Button component={Link} href={fixHref} variant='outlined'>
          {t(`${KEY}.detail.fixHere`)}
        </Button>
      )}

      {isOpen && isLinkConflict && (
        <HhaSyncLinkConflictActions exception={exception} onDone={onDone} />
      )}

      {isOpen && isInvitationPending && (
        <HhaSyncInviteAction exception={exception} onDone={onDone} />
      )}

      {isOpen && isCountyNotSetUp && (
        <HhaSyncAddCountyAction exception={exception} onDone={onDone} />
      )}

      {isOpen && !isLinkConflict && (
        <>
          <Button
            variant='outlined'
            color='secondary'
            disabled={isPending}
            onClick={() =>
              setNoteStatus(HHA_SYNC_EXCEPTION_ADMIN_STATUS.dismissed)
            }
          >
            {t(`${KEY}.detail.dismiss`)}
          </Button>
          <Button
            variant='contained'
            disabled={isPending}
            onClick={() =>
              setNoteStatus(HHA_SYNC_EXCEPTION_ADMIN_STATUS.resolved)
            }
          >
            {t(`${KEY}.detail.resolve`)}
          </Button>
        </>
      )}

      {!isOpen && (
        <Button
          variant='outlined'
          disabled={isPending}
          onClick={() => submit({status: HHA_SYNC_EXCEPTION_ADMIN_STATUS.open})}
        >
          {t(`${KEY}.detail.reopen`)}
        </Button>
      )}

      <ReasonDialog
        key={noteStatus || 'closed'}
        isOpen={Boolean(noteStatus)}
        onClose={() => setNoteStatus(null)}
        onConfirm={({reason}) =>
          submit({status: noteStatus || '', note: reason})
        }
        isLoading={isPending}
        title={t(
          `${KEY}.noteDialog.${isResolve ? 'resolveTitle' : 'dismissTitle'}`
        )}
        message={t(`${KEY}.noteDialog.message`)}
        reasonLabel={t(`${KEY}.noteDialog.noteLabel`)}
        reasonPlaceholder={t(`${KEY}.noteDialog.notePlaceholder`)}
        confirmLabel={t(`${KEY}.detail.${isResolve ? 'resolve' : 'dismiss'}`)}
        dismissLabel={t(`${KEY}.noteDialog.cancel`)}
        maxLength={HHA_SYNC_NOTE_MAX_LENGTH}
        confirmColor='primary'
        isReasonRequired={false}
      />
    </Box>
  );
};

export default HhaSyncExceptionActions;
