'use client';

import MuiLink from '@mui/material/Link';

import DetailFactsCard from '@/shared/components/common/DetailFactsCard';
import Link from '@/shared/components/common/localeLink';
import {ALERT_REVIEW_SIZES} from '@/shared/constants/alertReview';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {AlertPeopleRailProps} from '@/shared/interfaces/alertReview';

const AlertPeopleRail = ({
  people,
  patientId,
  hideReporter,
}: AlertPeopleRailProps) => {
  const {t} = useTranslation();

  return (
    <>
      <DetailFactsCard
        title={t('alertReview.people.patient')}
        facts={people.patientFacts}
        inline
        inlineLabelWidth={
          people.hasPatientRecord
            ? ALERT_REVIEW_SIZES.patientLabelWidth
            : undefined
        }
        divided={people.hasPatientRecord}
        footer={
          patientId && (
            <MuiLink
              component={Link}
              href={DASHBOARD_ROUTES.patients.single({id: patientId})}
              variant='small'
              sx={{fontWeight: 600, alignSelf: 'flex-start'}}
            >
              {t('alertReview.people.openPatientRecord')}
            </MuiLink>
          )
        }
      />

      {!hideReporter && (
        <DetailFactsCard
          title={t('alertReview.people.reportedBy')}
          facts={people.reporterFacts}
          inline
          inlineLabelWidth={ALERT_REVIEW_SIZES.peopleLabelWidth}
        />
      )}
    </>
  );
};

export default AlertPeopleRail;
