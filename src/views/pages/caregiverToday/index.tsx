'use client';

import {useMemo} from 'react';

import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import {CAREGIVER_DATE_FORMATS} from '@/shared/constants/caregiver';
import useCaregiverChecklists from '@/shared/hooks/useCaregiverChecklists';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverTodayViewProps} from '@/shared/interfaces/caregiverChecklist';
import {getGreetingKey} from '@/shared/utils/caregiverChecklists';
import {getCurrentDateTime, formatDate} from '@/shared/utils/dateUtils';

import TodayDesktop from './TodayDesktop';
import TodayPhone from './TodayPhone';

/**
 * Today: what the caregiver still owes, what is late, and what she already
 * sent. Everything comes from her own submissions list, so the counts and the
 * lists can never disagree.
 */
const CaregiverTodayView = () => {
  const {t} = useTranslation();
  const {currentUser} = useGetLoggedInUser();

  const isDesktop = useIsDesktop();

  const {checklists, late, dueToday, sentToday, isLoading, isError, refetch} =
    useCaregiverChecklists();

  const viewProps: CaregiverTodayViewProps = useMemo(() => {
    const now = getCurrentDateTime();

    return {
      greeting: t(
        `caregiverPortal.greeting.${getGreetingKey({hour: new Date().getHours()})}`,
        {name: currentUser?.firstName || ''}
      ),
      dateLabel: formatDate({
        date: now,
        format: isDesktop
          ? CAREGIVER_DATE_FORMATS.weekdayLong
          : CAREGIVER_DATE_FORMATS.headerDay,
      }),
      countEntries: [
        {
          key: 'checklists',
          value: checklists.filter(
            ({isOpen, isDueToday}) => isOpen && isDueToday
          ).length,
          label: t('caregiverPortal.today.counts.checklists'),
          isCritical: false,
        },
        {
          key: 'sent',
          value: sentToday.length,
          label: t('caregiverPortal.today.counts.sent'),
          isCritical: false,
        },
        {
          key: 'late',
          value: late.length,
          label: t('caregiverPortal.today.counts.late'),
          isCritical: late.length > 0,
        },
      ],
      late,
      dueToday,
      sentToday,
      isLoading,
    };
  }, [
    checklists,
    currentUser,
    dueToday,
    isDesktop,
    isLoading,
    late,
    sentToday,
    t,
  ]);

  // Her own work list did not load. An empty Today would read as "nothing to
  // do", which is the one thing it must never say by mistake.
  if (isError) {
    return (
      <ContentNotAvailable
        title={t('caregiverPortal.error.title')}
        message={t('caregiverPortal.error.message')}
        onBack={() => refetch()}
        backButtonText={t('caregiverPortal.error.retry')}
      />
    );
  }

  if (isDesktop) return <TodayDesktop {...viewProps} />;

  return <TodayPhone {...viewProps} />;
};

export default CaregiverTodayView;
