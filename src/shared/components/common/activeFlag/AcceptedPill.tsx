'use client';

import TimerPill from '@/shared/components/common/activeFlag/TimerPill';
import useTranslation from '@/shared/hooks/useTranslation';
import {AcceptedPillProps} from '@/shared/interfaces/flag';
import {formatElapsed, secondsBetweenIso} from '@/shared/utils/dateUtils';

// The frozen clock of an accepted flag: how long it waited before the
// assignee took it. Without the raise time it just says "Accepted".
const AcceptedPill = ({since, acceptedAt, accentColor}: AcceptedPillProps) => {
  const {t} = useTranslation();

  return (
    <TimerPill
      icon='mdi:account-check-outline'
      label={
        since
          ? t('alertReview.timing.acceptedIn')
          : t('flag.activeModal.accepted')
      }
      value={
        since
          ? formatElapsed({
              seconds: secondsBetweenIso({from: since, to: acceptedAt}),
            })
          : undefined
      }
      accentColor={accentColor}
      emphasis='soft'
    />
  );
};

export default AcceptedPill;
