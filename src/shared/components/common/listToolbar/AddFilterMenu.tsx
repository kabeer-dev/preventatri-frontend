'use client';

import {MouseEvent, useState} from 'react';

import {Icon} from '@iconify/react';
import ButtonBase from '@mui/material/ButtonBase';
import Popover from '@mui/material/Popover';

import {controlHeight, radius} from '@/@core/theme/spacing';
import {LIST_TOOLBAR} from '@/shared/constants/listToolbar';
import useTranslation from '@/shared/hooks/useTranslation';
import {ListToolbarFiltersProps} from '@/shared/interfaces/listToolbar';
import {ListFilterDrafts} from '@/shared/types/listToolbar';
import {getInitialFilterParam} from '@/shared/utils/listToolbar';

import AddFilterFieldList from './AddFilterFieldList';
import AddFilterValues from './AddFilterValues';

const AddFilterMenu = ({fields, onApply}: ListToolbarFiltersProps) => {
  const {t} = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeParam, setActiveParam] = useState('');
  const [drafts, setDrafts] = useState<ListFilterDrafts>({});

  const isOpen = Boolean(anchorEl);

  const draftFields = fields.map((field) => ({
    ...field,
    values: drafts[field.param] ?? field.values,
  }));

  const activeField = draftFields.find((field) => field.param === activeParam);

  const setActiveDraft = ({values}: {values: string[]}) => {
    if (!activeField) return;

    setDrafts((current) => ({...current, [activeField.param]: values}));
  };

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setActiveParam(getInitialFilterParam({fields}));
    setDrafts({});
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleApply = () => {
    onApply({drafts});
    handleClose();
  };

  return (
    <>
      <ButtonBase
        aria-haspopup='dialog'
        aria-expanded={isOpen}
        onClick={handleOpen}
        sx={{
          gap: 2,
          px: 3.75,
          minHeight: controlHeight.md,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          typography: 'bodyStrong',
          color: 'text.primary',
          bgcolor: 'customColors.segmentTrack',
          border: 1,
          borderColor: 'customColors.borderStrong',
          borderRadius: `${radius.md}px`,
          '&:hover': {bgcolor: 'customColors.ruleStrong'},
        }}
      >
        <Icon icon='mdi:filter-outline' fontSize={16} />
        {t('listToolbar.addFilter')}
        <Icon
          icon='mdi:chevron-down'
          fontSize={16}
          style={{
            opacity: 0.6,
            transform: isOpen ? 'rotate(180deg)' : undefined,
          }}
        />
      </ButtonBase>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        slotProps={{
          paper: {
            role: 'dialog',
            'aria-label': t('listToolbar.addFilter'),
            elevation: LIST_TOOLBAR.popoverElevation,
            sx: {
              mt: 1.5,
              width: LIST_TOOLBAR.popoverWidth,
              maxWidth: 'calc(100vw - 32px)',
              display: 'flex',
              flexDirection: {xs: 'column-reverse', sm: 'row'},
              overflowX: 'hidden',
              overflowY: 'auto',
              border: 1,
              borderColor: 'divider',
              borderRadius: `${radius.md}px`,
            },
          },
        }}
      >
        {activeField && (
          <AddFilterValues
            key={activeField.param}
            field={activeField}
            draft={activeField.values}
            onDraftChange={setActiveDraft}
            onReset={() => setActiveDraft({values: []})}
            onApply={handleApply}
          />
        )}
        <AddFilterFieldList
          fields={draftFields}
          activeParam={activeField?.param ?? ''}
          onSelect={({param}) => setActiveParam(param)}
        />
      </Popover>
    </>
  );
};

export default AddFilterMenu;
