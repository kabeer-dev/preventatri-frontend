'use client';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {SYSTEM_ROLES} from '@/shared/constants/common';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {
  SUPERVISORY_VISIT_CANCELLABLE_STATUSES,
  SUPERVISORY_VISIT_OPEN_STATUSES,

  // PREVENT-772: reopen removed for now; uncomment to restore.
  // SUPERVISORY_VISIT_REOPENABLE_STATUSES,
  SUPERVISORY_VISIT_REVIEWABLE_STATUSES,
  SUPERVISORY_VISIT_STATUS,
} from '@/shared/constants/supervisoryVisits';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import {useSupervisoryVisitActions} from '@/shared/hooks/useSupervisoryVisitActions';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {
  SupervisoryVisitActions,
  SupervisoryVisitDetail,
  SupervisoryVisitDetailsProps,
  SupervisoryVisitPermissions,
} from '@/shared/interfaces/supervisoryVisit';
import {
  followUpTaskMutations,
  supervisoryVisitQueries,
} from '@/shared/reactQuery';
import {FollowUpFormPayload} from '@/shared/types/followUp';
import {buildFollowUpPayload} from '@/shared/utils/followUpUtils';

import SupervisoryVisitDetailsUI from './SupervisoryVisitDetailsUI';
import SupervisoryVisitDialogs from './SupervisoryVisitDialogs';

const SupervisoryVisitDetails = ({id}: SupervisoryVisitDetailsProps) => {
  const {t} = useTranslation();
  const {push} = useLocaleRouter();
  const {isAdmin, isNurse, isCaseManager} = useUserRole();
  const {currentUser} = useGetLoggedInUser();
  const {zone} = useOrganizationTimeZone();

  const {useFetchSupervisoryVisit} = supervisoryVisitQueries();
  const {data, isLoading, isError, refetch} = useFetchSupervisoryVisit({id});

  const {useCreateFollowUpTaskMutation} = followUpTaskMutations();
  const createFollowUp = useCreateFollowUpTaskMutation();

  const visitActions = useSupervisoryVisitActions({id});
  const {modals, handlers} = visitActions;

  if (isLoading) return <PageSkeleton {...PAGE_SKELETONS.checklistRecord} />;

  const visit: SupervisoryVisitDetail | undefined = data?.visit;

  if (!visit || isError) {
    return (
      <ContentNotAvailable
        title={t('supervisoryVisits.detail.notFoundTitle')}
        message={t('supervisoryVisits.detail.notFoundMessage')}
      />
    );
  }

  // Mirrors the backend: admins, the creator or a case manager manage a
  // visit unless it already sits with an admin; only its assignee files it;
  // admins and case managers review it, never the person who filed it.
  const isOpen = SUPERVISORY_VISIT_OPEN_STATUSES.includes(visit.status);
  const isCreator = visit.createdBy === currentUser?.id;
  const isAssignee = visit.assignee?.user?.id === currentUser?.id;

  const isFiler =
    Boolean(visit.completedBy) && visit.completedBy === currentUser?.id;

  const isAdminOwned = visit.assignee?.role === SYSTEM_ROLES.admin.value;

  const canManage = isAdmin || (!isAdminOwned && (isCreator || isCaseManager));

  // PREVENT-772: reopen removed for now; uncomment to restore.
  // const canReopen = isAdmin || (!isAdminOwned && isCaseManager);

  const permissions: SupervisoryVisitPermissions = {
    canEdit: isOpen && canManage,
    canCancel:
      SUPERVISORY_VISIT_CANCELLABLE_STATUSES.includes(visit.status) &&
      canManage,
    canFile: isOpen && isAssignee,
    canReview:
      (isAdmin || isCaseManager) &&
      !isFiler &&
      SUPERVISORY_VISIT_REVIEWABLE_STATUSES.includes(visit.status),

    // canReopen:
    //   canReopen && SUPERVISORY_VISIT_REOPENABLE_STATUSES.includes(visit.status),
    canAddFollowUp:
      (isAdmin || isNurse || isCaseManager) &&
      visit.status !== SUPERVISORY_VISIT_STATUS.CANCELLED.value,
  };

  // The checklist is always answered one question at a time on its own page.
  const actions: SupervisoryVisitActions = Object.assign({}, handlers, {
    onFile: () =>
      push({url: DASHBOARD_ROUTES.supervisoryVisits.checklist({id})}),
  });

  const handleFollowUpSubmit = (values: FollowUpFormPayload) =>
    createFollowUp.mutate({
      payload: buildFollowUpPayload({values, supervisoryVisitId: id, zone}),
      callBackFuncs: {
        onSuccess: () => {
          modals.followUpModal.closeModal();
          refetch();
        },
      },
    });

  return (
    <>
      <SupervisoryVisitDetailsUI
        visit={visit}
        permissions={permissions}
        actions={actions}
      />

      <SupervisoryVisitDialogs
        visit={visit}
        actions={visitActions}
        onFollowUpSubmit={handleFollowUpSubmit}
        isCreatingFollowUp={createFollowUp.isPending}
      />
    </>
  );
};

export default SupervisoryVisitDetails;
