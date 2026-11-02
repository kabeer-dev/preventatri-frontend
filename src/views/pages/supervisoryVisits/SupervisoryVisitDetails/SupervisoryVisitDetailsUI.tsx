'use client';

import DetailSplitLayout from '@/shared/components/common/DetailSplitLayout';
import WorkItemPatientCard from '@/shared/components/common/WorkItemPatientCard';
import useTranslation from '@/shared/hooks/useTranslation';
import {SupervisoryVisitDetailsUIProps} from '@/shared/interfaces/supervisoryVisit';

import SupervisoryVisitCaregiversCard from './SupervisoryVisitCaregiversCard';
import SupervisoryVisitChecklistSection from './SupervisoryVisitChecklistSection';
import SupervisoryVisitDescriptionCard from './SupervisoryVisitDescriptionCard';
import SupervisoryVisitDetailsHeader from './SupervisoryVisitDetailsHeader';
import SupervisoryVisitFactsCard from './SupervisoryVisitFactsCard';
import SupervisoryVisitFindingsCard from './SupervisoryVisitFindingsCard';
import SupervisoryVisitFollowUpsCard from './SupervisoryVisitFollowUpsCard';
import SupervisoryVisitHistoryCard from './SupervisoryVisitHistoryCard';

const SupervisoryVisitDetailsUI = ({
  visit,
  permissions,
  actions,
}: SupervisoryVisitDetailsUIProps) => {
  const {t} = useTranslation();

  return (
    <>
      <SupervisoryVisitDetailsHeader
        visit={visit}
        permissions={permissions}
        actions={actions}
      />

      <DetailSplitLayout
        main={
          <>
            <SupervisoryVisitDescriptionCard visit={visit} />
            <SupervisoryVisitFindingsCard visit={visit} />
            <SupervisoryVisitChecklistSection visit={visit} />
            <SupervisoryVisitHistoryCard events={visit.events} />
          </>
        }
        rail={
          <>
            <SupervisoryVisitFactsCard visit={visit} />
            <SupervisoryVisitCaregiversCard visit={visit} />
            <SupervisoryVisitFollowUpsCard visit={visit} />
            <WorkItemPatientCard
              patientId={visit.patientId}
              patient={visit.patient}
              alert={visit.source.alert}
              title={t('supervisoryVisits.detail.patient')}
              openPatientLabel={t('supervisoryVisits.detail.openPatient')}
            />
          </>
        }
      />
    </>
  );
};

export default SupervisoryVisitDetailsUI;
