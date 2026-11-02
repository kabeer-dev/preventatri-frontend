'use client';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {SYSTEM_ROLES} from '@/shared/constants/common';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaseManagerDetailsProps} from '@/shared/interfaces/caseManagerDetails';
import {caseManagerQueries} from '@/shared/reactQuery';
import {transformCaseManagerResponse} from '@/shared/utils/caseManagerUtils';
import UserRecordActions from '@/views/pages/users/UserRecordActions';

import CaseManagerDetailsUI from './CaseManagerDetailsUI';

/**
 * Smart component for case manager details page.
 * Fetches case manager data from GET /case-managers/:id and passes it to the UI.
 */
export default function CaseManagerDetails({
  caseManagerId,
}: CaseManagerDetailsProps) {
  const {t} = useTranslation();

  const {useFetchCaseManager} = caseManagerQueries();
  const {data, isLoading} = useFetchCaseManager({id: caseManagerId});

  if (isLoading) return <PageSkeleton {...PAGE_SKELETONS.caseManagerDetails} />;

  const rawCaseManager = data?.caseManager;

  if (!rawCaseManager) {
    return (
      <ContentNotAvailable
        title={t('caseManager.notFoundTitle')}
        message={t('caseManager.notFoundMessage')}
      />
    );
  }

  const caseManager = transformCaseManagerResponse({
    caseManager: rawCaseManager,
  });

  return (
    <>
      {!caseManager.archived && (
        <UserRecordActions
          user={{
            role: SYSTEM_ROLES.caseManager.value,
            profileId: caseManagerId,
            firstName: caseManager.firstName,
            lastName: caseManager.lastName,
          }}
        />
      )}
      <CaseManagerDetailsUI caseManager={caseManager} />
    </>
  );
}
