'use client';

import {useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, useWatch} from 'react-hook-form';

import HhaCredentialsSkeleton from '@/shared/components/common/skeletons/HhaCredentialsSkeleton';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaCredentials} from '@/shared/interfaces/settings';
import {organizationMutations, organizationQueries} from '@/shared/reactQuery';
import {hhaCredentialsSchema} from '@/shared/schemas/settings';
import {HhaCredentialsFormPayload} from '@/shared/types/settings';
import {hasQuerySettledSince} from '@/shared/utils/reactQuery';

import HhaCredentialsCardUI from './HhaCredentialsCardUI';

const EMPTY_FORM: HhaCredentialsFormPayload = {
  appName: '',
  appSecret: '',
  appKey: '',
};

const NOT_CONNECTED: HhaCredentials = {
  isConnected: false,
  appName: null,
  lastVerifiedAt: null,
  lastError: null,
};

const HhaCredentialsCard = () => {
  const {ct} = useTranslation();
  const {useFetchHhaCredentials} = organizationQueries();

  const {useSaveHhaCredentialsMutation, useDisconnectHhaCredentialsMutation} =
    organizationMutations();

  const {data, isLoading, dataUpdatedAt, errorUpdatedAt} =
    useFetchHhaCredentials();

  const {mutate: saveCredentials, isPending: isSaving} =
    useSaveHhaCredentialsMutation();

  const {mutate: disconnectCredentials, isPending: isDisconnecting} =
    useDisconnectHhaCredentialsMutation();

  const [isReplacing, setIsReplacing] = useState(false);
  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const {control, handleSubmit, reset} = useForm<HhaCredentialsFormPayload>({
    resolver: zodResolver(ct({constant: hhaCredentialsSchema})),
    defaultValues: EMPTY_FORM,
  });

  const [appName, appSecret, appKey] = useWatch({
    control,
    name: ['appName', 'appSecret', 'appKey'],
  });

  // After a save the form stays open and locked until the refetch the save
  // triggered lands, so the old connection state never flashes back.
  const isSyncing =
    savedAt !== null &&
    !hasQuerySettledSince({since: savedAt, dataUpdatedAt, errorUpdatedAt});

  if (isLoading) return <HhaCredentialsSkeleton />;

  const credentials: HhaCredentials = data?.hhaCredentials ?? NOT_CONNECTED;

  const isFormBusy = isSaving || isSyncing;
  const isFilled = Boolean(appName?.trim() && appSecret && appKey);

  const handleSave = handleSubmit((payload) => {
    saveCredentials({
      payload,
      callBackFuncs: {
        onSuccess: () => {
          reset(EMPTY_FORM);
          setIsReplacing(false);
          setSavedAt(Date.now());
        },
      },
    });
  });

  const handleReplace = () => {
    reset(EMPTY_FORM);
    setIsReplacing(true);
  };

  const handleCancelReplace = () => {
    reset(EMPTY_FORM);
    setIsReplacing(false);
  };

  const handleDisconnect = () => {
    disconnectCredentials({
      callBackFuncs: {
        onSuccess: () => {
          setIsDisconnectOpen(false);
          setIsReplacing(false);
          reset(EMPTY_FORM);
        },
      },
    });
  };

  return (
    <HhaCredentialsCardUI
      credentials={credentials}
      isFormOpen={!credentials.isConnected || isReplacing || isSyncing}
      formProps={{
        control,
        canSubmit: isFilled && !isFormBusy,
        isSaving: isFormBusy,
        isReplacing: isReplacing && credentials.isConnected,
        onSubmit: handleSave,
        onCancel: handleCancelReplace,
      }}
      isDisconnectOpen={isDisconnectOpen}
      isDisconnecting={isDisconnecting}
      onReplace={handleReplace}
      onDisconnectOpen={() => setIsDisconnectOpen(true)}
      onDisconnectCancel={() => setIsDisconnectOpen(false)}
      onDisconnectConfirm={handleDisconnect}
    />
  );
};

export default HhaCredentialsCard;
