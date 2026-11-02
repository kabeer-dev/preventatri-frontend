'use client';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import {CHECKLIST_BUILDER_ICONS} from '@/shared/constants/checklistBuilder';
import useTranslation from '@/shared/hooks/useTranslation';
import {BuilderRowActionsProps} from '@/shared/interfaces/checklistBuilder';

// Shared by sections, questions and answers so every row reorders the same way.
const BuilderRowActions = ({
  index,
  count,
  onMove,
  onRemove,
}: BuilderRowActionsProps) => {
  const {t} = useTranslation();

  return (
    <Box
      className='flex items-center'
      onClick={(event) => event.stopPropagation()}
    >
      <IconButton
        size='small'
        aria-label={t('assessmentChecklists.builder.actions.moveUp')}
        disabled={index === 0}
        onClick={() => onMove({from: index, to: index - 1})}
      >
        <Icon icon={CHECKLIST_BUILDER_ICONS.moveUp} fontSize={18} />
      </IconButton>
      <IconButton
        size='small'
        aria-label={t('assessmentChecklists.builder.actions.moveDown')}
        disabled={index === count - 1}
        onClick={() => onMove({from: index, to: index + 1})}
      >
        <Icon icon={CHECKLIST_BUILDER_ICONS.moveDown} fontSize={18} />
      </IconButton>
      <IconButton
        size='small'
        aria-label={t('assessmentChecklists.builder.actions.remove')}
        onClick={onRemove}
      >
        <Icon icon={CHECKLIST_BUILDER_ICONS.delete} fontSize={18} />
      </IconButton>
    </Box>
  );
};

export default BuilderRowActions;
