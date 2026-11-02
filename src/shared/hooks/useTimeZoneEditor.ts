import {useState} from 'react';

import {organizationMutations, organizationQueries} from '@/shared/reactQuery';
import {TimeZoneKey} from '@/shared/types/settings';
import {hasQuerySettledSince} from '@/shared/utils/reactQuery';

// Owns the time zone edit draft and its own save/cancel flow, so the
// organization settings card can save the time zone independently of the
// working-hours panel — each hits a different API endpoint.
export const useTimeZoneEditor = () => {
  const {useFetchTimeZone} = organizationQueries();
  const {useUpdateTimeZoneMutation} = organizationMutations();

  const {data, isLoading, dataUpdatedAt, errorUpdatedAt} = useFetchTimeZone();
  const {mutate: updateTimeZone, isPending} = useUpdateTimeZoneMutation();

  const timeZone: TimeZoneKey | undefined = data?.timeZone?.key;

  const [isEditing, setIsEditing] = useState(false);

  const [timeZoneDraft, setTimeZoneDraft] = useState<TimeZoneKey | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // After a save the draft stays in edit mode, locked, until the refetch the
  // save triggered lands; leaving edit mode earlier shows the old time zone.
  const isSyncing =
    savedAt !== null &&
    !hasQuerySettledSince({since: savedAt, dataUpdatedAt, errorUpdatedAt});

  const isEditingTimeZone = isEditing && (savedAt === null || isSyncing);

  const selectedTimeZone = isEditingTimeZone ? timeZoneDraft : timeZone;

  const handleStartEditingTimeZone = () => {
    setTimeZoneDraft(timeZone ?? null);
    setSavedAt(null);
    setIsEditing(true);
  };

  const handleCancelEditingTimeZone = () => {
    setIsEditing(false);
    setTimeZoneDraft(null);
  };

  const handleSaveTimeZone = () => {
    if (!timeZoneDraft || isSyncing) return;

    updateTimeZone({
      payload: {timeZone: timeZoneDraft},
      callBackFuncs: {
        onSuccess: () => setSavedAt(Date.now()),
      },
    });
  };

  return {
    isLoading,
    selectedTimeZone,
    isEditingTimeZone,
    isPending: isPending || isSyncing,
    setTimeZoneDraft,
    handleStartEditingTimeZone,
    handleCancelEditingTimeZone,
    handleSaveTimeZone,
  };
};
