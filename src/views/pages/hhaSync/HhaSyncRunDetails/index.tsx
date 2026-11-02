'use client';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  HhaSyncRun,
  HhaSyncRunDetailsProps,
} from '@/shared/interfaces/hhaSyncHistory';
import {hhaExchangeQueries} from '@/shared/reactQuery';

import HhaSyncRunDetailsUI from './HhaSyncRunDetailsUI';

// Loads one run (GET /integration/sync/runs/:id) for the run detail page.
const HhaSyncRunDetails = ({runId}: HhaSyncRunDetailsProps) => {
  const {t} = useTranslation();
  const {useFetchHhaSyncRun} = hhaExchangeQueries();

  const {data, isLoading} = useFetchHhaSyncRun({id: runId});

  if (isLoading) return <PageSkeleton {...PAGE_SKELETONS.hhaSyncRun} />;

  const run: HhaSyncRun | undefined = data?.syncRun;

  if (!run) {
    return (
      <ContentNotAvailable
        title={t('hhaSyncHistory.runs.detail.notFoundTitle')}
        message={t('hhaSyncHistory.runs.detail.notFoundMessage')}
      />
    );
  }

  return <HhaSyncRunDetailsUI run={run} />;
};

export default HhaSyncRunDetails;
