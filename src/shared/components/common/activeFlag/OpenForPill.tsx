'use client';

import TimerPill from '@/shared/components/common/activeFlag/TimerPill';
import {useElapsedTime} from '@/shared/hooks/useElapsedTime';
import useTranslation from '@/shared/hooks/useTranslation';
import {OpenForPillProps} from '@/shared/interfaces/flag';

// Owns its ticking hook so only this pill re-renders each second.
const OpenForPill = ({since, accentColor}: OpenForPillProps) => {
  const {t} = useTranslation();
  const {formatted} = useElapsedTime({since});

  return (
    <TimerPill
      icon='mdi:clock-outline'
      label={t('alertReview.timing.openFor')}
      value={formatted}
      accentColor={accentColor}
      emphasis='soft'
    />
  );
};

export default OpenForPill;
