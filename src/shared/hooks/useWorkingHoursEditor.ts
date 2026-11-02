import {useState} from 'react';

import {DAYS_ORDER} from '@/shared/constants/settings';
import {organizationMutations, organizationQueries} from '@/shared/reactQuery';
import {DayOfWeek, WorkingHours} from '@/shared/types/settings';
import {hasQuerySettledSince} from '@/shared/utils/reactQuery';

type TimeFieldKey = 'startTime' | 'endTime';

// Owns the working-hours edit draft and its own save/cancel flow, so the
// organization settings card can save working hours independently of the
// time zone panel — each hits a different API endpoint.
export const useWorkingHoursEditor = () => {
  const {useFetchWorkingHours} = organizationQueries();
  const {useUpdateWorkingHoursMutation} = organizationMutations();

  const {data, isLoading, dataUpdatedAt, errorUpdatedAt} =
    useFetchWorkingHours();

  const {mutate: updateWorkingHours, isPending} =
    useUpdateWorkingHoursMutation();

  const workingHours: WorkingHours | undefined = data?.workingHours;

  const [isEditing, setIsEditing] = useState(false);
  const [editingDraft, setEditingDraft] = useState<WorkingHours | null>(null);
  const [sameForAllDays, setSameForAllDays] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // After a save the draft stays in edit mode, locked, until the refetch the
  // save triggered lands; leaving edit mode earlier shows the old hours.
  const isSyncing =
    savedAt !== null &&
    !hasQuerySettledSince({since: savedAt, dataUpdatedAt, errorUpdatedAt});

  const isEditingHours = isEditing && (savedAt === null || isSyncing);

  const hours = isEditingHours ? editingDraft : workingHours;

  const handleStartEditingHours = () => {
    if (!workingHours) return;

    setEditingDraft(workingHours);
    setSameForAllDays(false);
    setSavedAt(null);
    setIsEditing(true);
  };

  const handleCancelEditingHours = () => {
    setIsEditing(false);
    setEditingDraft(null);
    setSameForAllDays(false);
  };

  const handleToggleSameForAllDays = () => {
    setSameForAllDays((current) => !current);
  };

  const handleToggleDayEnabled = ({day}: {day: DayOfWeek}) => {
    setEditingDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        [day]: {...current[day], enabled: !current[day].enabled},
      };
    });
  };

  const handleDayTimeChange = ({
    day,
    field,
    value,
  }: {
    day: DayOfWeek;
    field: TimeFieldKey;
    value: string;
  }) => {
    setEditingDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        [day]: {...current[day], [field]: value},
      };
    });
  };

  const handleSharedTimeChange = ({
    field,
    value,
  }: {
    field: TimeFieldKey;
    value: string;
  }) => {
    setEditingDraft((current) => {
      if (!current) return current;

      const updated = {...current};

      DAYS_ORDER.forEach((day) => {
        updated[day] = {...updated[day], [field]: value};
      });

      return updated;
    });
  };

  const handleSaveHours = () => {
    if (!editingDraft || isSyncing) return;

    updateWorkingHours({
      payload: {workingHours: editingDraft},
      callBackFuncs: {
        onSuccess: () => setSavedAt(Date.now()),
      },
    });
  };

  return {
    isLoading,
    hours,
    isEditingHours,
    sameForAllDays,
    isPending: isPending || isSyncing,
    handleStartEditingHours,
    handleCancelEditingHours,
    handleToggleSameForAllDays,
    handleToggleDayEnabled,
    handleDayTimeChange,
    handleSharedTimeChange,
    handleSaveHours,
  };
};
