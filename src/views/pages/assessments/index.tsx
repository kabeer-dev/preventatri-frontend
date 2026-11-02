'use client';

import {useMemo} from 'react';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import PageSkeleton from '@/shared/components/common/skeletons/PageSkeleton';
import {PAGE_SKELETONS} from '@/shared/constants/pageSkeletons';
import useTranslation from '@/shared/hooks/useTranslation';
import {UpcomingAssessment} from '@/shared/interfaces/submission';
import {patientQueries} from '@/shared/reactQuery';
import {transformPatientResponse} from '@/shared/utils/patientUtils';

import AssessmentsPageUI from './AssessmentsPageUI';

interface AssessmentsPageProps {
  patientId: string;
}

const AssessmentsPage = ({patientId}: AssessmentsPageProps) => {
  const {t} = useTranslation();
  const {useFetchPatient, useFetchPatientAssessments} = patientQueries();

  const {data, isLoading, isError} = useFetchPatient({id: patientId});

  const {
    data: assessmentsData,
    isLoading: isAssessmentsLoading,
    isError: isAssessmentsError,
    refetch: refetchAssessments,
  } = useFetchPatientAssessments({id: patientId});

  const patient = useMemo(() => {
    const raw = data?.patient;
    if (!raw) return null;

    return transformPatientResponse({patient: raw});
  }, [data]);

  const upcomingAssessments: UpcomingAssessment[] = useMemo(() => {
    return assessmentsData?.submissions || [];
  }, [assessmentsData]);

  if (isLoading || isAssessmentsLoading) {
    return <PageSkeleton {...PAGE_SKELETONS.assessments} />;
  }

  if (!patient || isError) {
    return (
      <ContentNotAvailable
        title={t('patients.notFoundTitle')}
        message={t('patients.notFoundMessage')}
      />
    );
  }

  return (
    <AssessmentsPageUI
      patient={patient}
      totalMonitoredWeeks={0}
      previousRedFlags={0}
      upcomingAssessments={upcomingAssessments}
      isAssessmentsError={isAssessmentsError}
      onRetryAssessments={refetchAssessments}
    />
  );
};

export default AssessmentsPage;
