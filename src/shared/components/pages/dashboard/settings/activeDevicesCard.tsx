'use client';

import {useState} from 'react';

import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {ConfirmationModal} from '@/shared/components/common/modals/ConfirmationModal';
import SkeletonCard from '@/shared/components/common/skeletons/SkeletonCard';
import {WIDGET_SKELETONS} from '@/shared/constants/pageSkeletons';
import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import {useModal} from '@/shared/hooks/modals/useModal';
import useTranslation from '@/shared/hooks/useTranslation';
import {Session} from '@/shared/interfaces/settings';
import {sessionMutations, sessionQueries} from '@/shared/reactQuery';
import {formatRelativeTime} from '@/shared/utils/formatRelativeTime';

const MOBILE_OS_PATTERN = /android|ios|iphone|ipad/i;

const getDeviceLabel = ({session}: {session: Session}) =>
  `${session.device} · ${session.os}`;

const ActiveDevicesCard = () => {
  const {t} = useTranslation();
  const {useFetchSessionsList} = sessionQueries();

  const {useRevokeSessionMutation, useSignOutOtherDevicesMutation} =
    sessionMutations();

  const {data, isLoading} = useFetchSessionsList();

  const {mutate: revokeSession, isPending: isRevoking} =
    useRevokeSessionMutation();

  const {mutate: signOutOtherDevices, isPending: isSigningOutOthers} =
    useSignOutOtherDevicesMutation();

  const sessions: Session[] = data?.sessions || [];

  const otherSessionsCount = sessions.filter(
    (session) => !session.isCurrent
  ).length;

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const {
    isModalOpen: isSignOutModalOpen,
    closeModal: closeSignOutModal,
    openModal: openSignOutModal,
  } = useModal();

  const {
    isModalOpen: isSignOutAllModalOpen,
    closeModal: closeSignOutAllModal,
    openModal: openSignOutAllModal,
  } = useModal();

  const clearSelectedSession = () => {
    setTimeout(() => {
      setSelectedSession(null);
    }, POST_MODAL_CLEANUP_DELAY);
  };

  const handleSignOutClick = ({session}: {session: Session}) => {
    setSelectedSession(session);
    openSignOutModal();
  };

  const handleCancelSignOut = () => {
    closeSignOutModal();
    clearSelectedSession();
  };

  const handleConfirmSignOut = () => {
    if (!selectedSession) return;

    revokeSession({
      params: {sessionId: selectedSession.id},
      callBackFuncs: {onSuccess: handleCancelSignOut},
    });
  };

  const handleCancelSignOutAllDevices = () => {
    closeSignOutAllModal();
  };

  const handleConfirmSignOutFromAllDevices = () => {
    signOutOtherDevices({
      callBackFuncs: {onSuccess: closeSignOutAllModal},
    });
  };

  return (
    <>
      <Stack
        direction={{xs: 'column', sm: 'row'}}
        spacing={2}
        sx={{
          mb: 6,
          justifyContent: 'space-between',
          alignItems: {xs: 'flex-start', sm: 'center'},
        }}
      >
        <div>
          <Typography variant='h5'>{t('activeDevices.heading')}</Typography>
          <Typography variant='body2' sx={{color: 'text.secondary'}}>
            {t('activeDevices.subheading')}
          </Typography>
        </div>

        <Button
          variant='outlined'
          color='error'
          disabled={otherSessionsCount === 0}
          onClick={openSignOutAllModal}
          className='w-auto'
        >
          {t('activeDevices.signOutFromAllDevices')}
        </Button>
      </Stack>

      {isLoading && (
        <SkeletonCard
          surface='plain'
          header='none'
          divided
          row={{
            leading: 'square',
            leadingSize: WIDGET_SKELETONS.activeDevices.iconSize,
            trailing: 'button',
            sx: {py: WIDGET_SKELETONS.activeDevices.rowPaddingY},
          }}
        />
      )}

      <Stack divider={<Divider />} spacing={4}>
        {sessions.map((session) => (
          <Stack
            key={session.id}
            direction='row'
            spacing={2}
            sx={{alignItems: 'center', justifyContent: 'space-between'}}
          >
            <Stack direction='row' spacing={3} sx={{alignItems: 'center'}}>
              <Icon
                icon={
                  MOBILE_OS_PATTERN.test(session.os)
                    ? 'mdi:cellphone'
                    : 'mdi:monitor'
                }
                fontSize={28}
              />
              <div>
                <Stack direction='row' spacing={2} sx={{alignItems: 'center'}}>
                  <Typography variant='body' sx={{fontWeight: 500}}>
                    {getDeviceLabel({session})}
                  </Typography>
                  {session.isCurrent && (
                    <Chip
                      label={t('activeDevices.thisDevice')}
                      size='small'
                      color='primary'
                      variant='outlined'
                    />
                  )}
                </Stack>
                <Typography variant='body2' sx={{color: 'text.secondary'}}>
                  {session.browser} · {session.ipAddress} ·{' '}
                  {t('activeDevices.activeSince', {
                    time: formatRelativeTime({dateString: session.createdAt}),
                  })}
                </Typography>
              </div>
            </Stack>

            {!session.isCurrent && (
              <Button
                variant='text'
                color='error'
                onClick={() => handleSignOutClick({session})}
                className='w-auto'
              >
                {t('activeDevices.signOut')}
              </Button>
            )}
          </Stack>
        ))}

        {!isLoading && otherSessionsCount === 0 && (
          <Typography variant='body2' sx={{color: 'text.secondary'}}>
            {t('activeDevices.noOtherDevices')}
          </Typography>
        )}
      </Stack>

      <ConfirmationModal
        isOpen={isSignOutModalOpen}
        title={t('activeDevices.signOutConfirmTitle')}
        content={t('activeDevices.signOutConfirmMessage', {
          device: selectedSession
            ? getDeviceLabel({session: selectedSession})
            : '',
        })}
        confirmLabel={t('activeDevices.signOut')}
        onCancel={handleCancelSignOut}
        onConfirm={handleConfirmSignOut}
        confirmLoading={isRevoking}
      />

      <ConfirmationModal
        isOpen={isSignOutAllModalOpen}
        title={t('activeDevices.signOutFromAllDevicesConfirmTitle')}
        content={t('activeDevices.signOutFromAllDevicesConfirmMessage')}
        confirmLabel={t('activeDevices.signOutFromAllDevices')}
        onCancel={handleCancelSignOutAllDevices}
        onConfirm={handleConfirmSignOutFromAllDevices}
        confirmLoading={isSigningOutOthers}
      />
    </>
  );
};

export default ActiveDevicesCard;
