'use client';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {SYSTEM_ROLES} from '@/shared/constants/common';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverDetailsProps} from '@/shared/interfaces/caregiverDetails';
import {caregiverQueries} from '@/shared/reactQuery';
import {transformCaregiverResponse} from '@/shared/utils/caregiverUtils';
import UserRecordActions from '@/views/pages/users/UserRecordActions';

import CaregiverDetailsUI from './CaregiverDetailsUI';

/**
 * Smart component for caregiver details page.
 * Fetches caregiver data from GET /caregivers/:id and passes it to the UI.
 */
export default function CaregiverDetails({caregiverId}: CaregiverDetailsProps) {
  const {t} = useTranslation();

  const {useFetchCaregiver, useFetchCaregiverStatistics} = caregiverQueries();
  const {data, isLoading} = useFetchCaregiver({id: caregiverId});

  const {data: statsData, isLoading: isStatsLoading} =
    useFetchCaregiverStatistics({
      id: caregiverId,
      params: {...SUB_ROUTE_PARAMS},
    });

  if (isLoading) return <PageSkeleton {...PAGE_SKELETONS.caregiverDetails} />;

  const rawCaregiver = data?.caregiver;

  if (!rawCaregiver) {
    return (
      <ContentNotAvailable
        title={t('caregiver.notFoundTitle')}
        message={t('caregiver.notFoundMessage')}
      />
    );
  }

  const caregiver = transformCaregiverResponse({caregiver: rawCaregiver});
  const statistics = statsData?.statistics;

  return (
    <>
      {!caregiver.archived && (
        <UserRecordActions
          user={{
            role: SYSTEM_ROLES.caregiver.value,
            profileId: caregiverId,
            firstName: caregiver.firstName,
            lastName: caregiver.lastName,
          }}
        />
      )}
      <CaregiverDetailsUI
        caregiver={caregiver}
        statistics={statistics}
        isStatsLoading={isStatsLoading}
      />
    </>
  );
}
