'use client';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {SYSTEM_ROLES} from '@/shared/constants/common';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import useTranslation from '@/shared/hooks/useTranslation';
import {NurseDetailsProps} from '@/shared/interfaces/nurseDetails';
import {nurseQueries} from '@/shared/reactQuery';
import {transformNurseResponse} from '@/shared/utils/nurseUtils';
import UserRecordActions from '@/views/pages/users/UserRecordActions';

import NurseDetailsUI from './NurseDetailsUI';

/**
 * Smart component for nurse details page.
 * Fetches nurse data from GET /nurses/:id and passes it to the UI.
 */
export default function NurseDetails({nurseId}: NurseDetailsProps) {
  const {t} = useTranslation();

  const {useFetchNurse} = nurseQueries();
  const {data, isLoading} = useFetchNurse({id: nurseId});

  if (isLoading) return <PageSkeleton {...PAGE_SKELETONS.nurseDetails} />;

  const rawNurse = data?.nurse;

  if (!rawNurse) {
    return (
      <ContentNotAvailable
        title={t('nurse.notFoundTitle')}
        message={t('nurse.notFoundMessage')}
      />
    );
  }

  const nurse = transformNurseResponse({nurse: rawNurse});

  return (
    <>
      {!nurse.archived && (
        <UserRecordActions
          user={{
            role: SYSTEM_ROLES.nurse.value,
            profileId: nurseId,
            firstName: nurse.firstName,
            lastName: nurse.lastName,
          }}
        />
      )}
      <NurseDetailsUI nurse={nurse} />
    </>
  );
}
