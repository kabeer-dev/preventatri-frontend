import {useQueryClient} from '@tanstack/react-query';

import {EMERGENCY_FLAGS, FLAGS} from '@/shared/constants/reactQueryConstants';
import {STALE_ACCEPT_ERROR_TYPES} from '@/shared/constants/responses/errors/assessments';
import {AcceptFlagParams} from '@/shared/interfaces/flag';
import {useMutations as useFlagMutations} from '@/shared/reactQuery/flags/mutations';

// The assignee accepts their flag, which stops its escalation. When the flag
// on screen turns out to be stale (it already moved on, or was accepted,
// resolved or voided), the flag lists are refreshed so it drops away.
const useAcceptFlag = () => {
  const queryClient = useQueryClient();
  const {useAcceptFlagMutation} = useFlagMutations();
  const {mutate, isPending} = useAcceptFlagMutation();

  const acceptFlag = ({escalationId, onAccepted}: AcceptFlagParams) =>
    mutate({
      params: {id: escalationId},
      callBackFuncs: {
        onSuccess: onAccepted,
        onError: (err: {error?: {type?: string}}) => {
          if (!STALE_ACCEPT_ERROR_TYPES.includes(err?.error?.type ?? ''))
            return;

          queryClient.invalidateQueries({
            queryKey: [FLAGS.fetchActiveFlags.queryKey],
          });
          queryClient.invalidateQueries({
            queryKey: [EMERGENCY_FLAGS.fetchEmergencyFlag.queryKey],
          });
        },
      },
    });

  return {acceptFlag, isAccepting: isPending};
};

export default useAcceptFlag;
