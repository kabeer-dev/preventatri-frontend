'use client';

import {CAREGIVER_SOURCE} from '@/shared/constants/caregivers';
import {CASE_MANAGER_SOURCE} from '@/shared/constants/caseManagers';
import {SYSTEM_ROLES} from '@/shared/constants/common';
import {EditUserModalProps} from '@/shared/interfaces/orgUser';
import {
  caregiverMutations,
  caregiverQueries,
  caseManagerMutations,
  caseManagerQueries,
  nurseMutations,
  nurseQueries,
} from '@/shared/reactQuery';
import {CaregiverFormValues} from '@/shared/types/caregiver';
import {CaseManagerFormValues} from '@/shared/types/caseManager';
import {NurseFormValues} from '@/shared/types/nurse';
import {
  buildCaregiverUpdatePayload,
  transformCaregiverResponse,
} from '@/shared/utils/caregiverUtils';
import {
  buildCaseManagerUpdatePayload,
  transformCaseManagerResponse,
} from '@/shared/utils/caseManagerUtils';
import {
  buildNurseUpdatePayload,
  transformNurseResponse,
} from '@/shared/utils/nurseUtils';
import CaregiverModal from '@/views/pages/caregivers/CaregiverModal';
import CaseManagerModal from '@/views/pages/caseManagers/CaseManagerModal';
import NurseModal from '@/views/pages/nurses/NurseModal';

/**
 * Edits one roster row in that role's own modal.
 *
 * The roster row carries only summary fields, so the full profile is fetched by
 * profileId first -- the modals expect the complete record. All three queries
 * are declared (hooks cannot be conditional) but only the row's role is
 * enabled, so exactly one request goes out.
 */
const EditUserModal = ({user, onClose}: EditUserModalProps) => {
  const isNurse = user.role === SYSTEM_ROLES.nurse.value;
  const isCaregiver = user.role === SYSTEM_ROLES.caregiver.value;
  const isCaseManager = user.role === SYSTEM_ROLES.caseManager.value;

  const id = user.profileId as string;

  const {useFetchNurse} = nurseQueries();
  const {useFetchCaregiver} = caregiverQueries();
  const {useFetchCaseManager} = caseManagerQueries();

  const {data: nurseData} = useFetchNurse({id, enabled: isNurse});
  const {data: caregiverData} = useFetchCaregiver({id, enabled: isCaregiver});

  const {data: caseManagerData} = useFetchCaseManager({
    id,
    enabled: isCaseManager,
  });

  const {useUpdateNurseMutation} = nurseMutations();
  const {useUpdateCaregiverMutation} = caregiverMutations();
  const {useUpdateCaseManagerMutation} = caseManagerMutations();

  const {mutate: updateNurse, isPending: isSavingNurse} =
    useUpdateNurseMutation();

  const {mutate: updateCaregiver, isPending: isSavingCaregiver} =
    useUpdateCaregiverMutation();

  const {mutate: updateCaseManager, isPending: isSavingCaseManager} =
    useUpdateCaseManagerMutation();

  const callBackFuncs = {onSuccess: onClose};

  const nurse = nurseData?.nurse
    ? transformNurseResponse({nurse: nurseData.nurse})
    : null;

  const caregiver = caregiverData?.caregiver
    ? transformCaregiverResponse({caregiver: caregiverData.caregiver})
    : null;

  const caseManager = caseManagerData?.caseManager
    ? transformCaseManagerResponse({caseManager: caseManagerData.caseManager})
    : null;

  const isHhaCaregiver =
    caregiver?.source === CAREGIVER_SOURCE.hhaExchange.value;

  const isHhaCaseManager =
    caseManager?.source === CASE_MANAGER_SOURCE.hhaExchange.value;

  return (
    <>
      <NurseModal
        isOpen={isNurse && Boolean(nurse)}
        onClose={onClose}
        onSubmit={(data: NurseFormValues) =>
          updateNurse({
            payload: buildNurseUpdatePayload({data, nurse}),
            params: {id},
            callBackFuncs,
          })
        }
        isLoading={isSavingNurse}
        nurse={nurse}
      />

      <CaregiverModal
        isOpen={isCaregiver && Boolean(caregiver)}
        onClose={onClose}
        onSubmit={(data: CaregiverFormValues) =>
          updateCaregiver({
            payload: buildCaregiverUpdatePayload({
              data,

              // Drops the fields HHAeXchange owns; the disabled inputs still
              // submit them and the backend rejects on presence.
              isHhaManaged: isHhaCaregiver,

              // Email is accepted on an imported caregiver only while it is
              // still the placeholder the sync minted.
              canEditEmail:
                isHhaCaregiver && Boolean(caregiver?.isPlaceholderEmail),
            }),
            params: {id},
            callBackFuncs,
          })
        }
        isLoading={isSavingCaregiver}
        caregiver={caregiver}
      />

      <CaseManagerModal
        isOpen={isCaseManager && Boolean(caseManager)}
        onClose={onClose}
        onSubmit={(data: CaseManagerFormValues) =>
          updateCaseManager({
            payload: buildCaseManagerUpdatePayload({
              data,
              isHhaManaged: isHhaCaseManager,
              canEditEmail:
                isHhaCaseManager && Boolean(caseManager?.isPlaceholderEmail),
            }),
            params: {id},
            callBackFuncs,
          })
        }
        isLoading={isSavingCaseManager}
        caseManager={caseManager}
      />
    </>
  );
};

export default EditUserModal;
