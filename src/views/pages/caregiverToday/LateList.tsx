'use client';

import {useState} from 'react';

import Button from '@mui/material/Button';

import {CAREGIVER_LATE_PREVIEW_COUNT} from '@/shared/constants/caregiver';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverChecklist} from '@/shared/interfaces/caregiverChecklist';

import LateChecklistCard from './LateChecklistCard';

interface Props {
  late: CaregiverChecklist[];

  /** Desktop lays each card out in a row and keeps the button to its width. */
  inline?: boolean;
}

/**
 * The late cards above the day's list, cut to a few until "Show all" is
 * tapped. Renders as a fragment so the parent's column spacing applies.
 */
const LateList = ({late, inline = false}: Props) => {
  const {t} = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasMore = late.length > CAREGIVER_LATE_PREVIEW_COUNT;

  const visible = isExpanded
    ? late
    : late.slice(0, CAREGIVER_LATE_PREVIEW_COUNT);

  return (
    <>
      {visible.map((checklist) => (
        <LateChecklistCard
          key={checklist.id}
          checklist={checklist}
          inline={inline}
        />
      ))}

      {hasMore && (
        <Button
          variant='outlined'
          onClick={() => setIsExpanded((current) => !current)}
          sx={{fontWeight: 600, ...(inline && {alignSelf: 'flex-start'})}}
        >
          {isExpanded
            ? t('caregiverPortal.today.late.showFewer')
            : t('caregiverPortal.today.late.showAll', {count: late.length})}
        </Button>
      )}
    </>
  );
};

export default LateList;
