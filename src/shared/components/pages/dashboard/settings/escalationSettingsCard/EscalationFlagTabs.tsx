'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import {controlHeight, radius} from '@/@core/theme/spacing';
import useTranslation from '@/shared/hooks/useTranslation';
import {EscalationFlagTabsProps} from '@/shared/interfaces/settings';

// Switches the editor between the red and yellow flag templates. Each tab
// shows its colour and step count, and a dot when it has unsaved edits. On a
// phone the tabs stack full width, red above yellow, instead of sharing a row.
const EscalationFlagTabs = ({
  value,
  tabs,
  onChange,
}: EscalationFlagTabsProps) => {
  const {t} = useTranslation();

  return (
    <Box
      role='group'
      aria-label={t('escalationSettings.flagTabsAriaLabel')}
      className='bg-segment-track flex w-full flex-col gap-1.5 p-1 sm:flex-row'
      sx={{borderRadius: `${radius.md}px`}}
    >
      {tabs.map((tab) => {
        const isSelected = tab.value === value;

        return (
          <ButtonBase
            key={tab.value}
            aria-pressed={isSelected}
            onClick={() => onChange(tab.value)}
            className='justify-between gap-2 px-3.5 sm:flex-1'
            sx={{
              minHeight: controlHeight.md,
              borderRadius: `${radius.sm}px`,
              bgcolor: isSelected ? 'background.paper' : 'transparent',
              boxShadow: isSelected ? 1 : 0,
            }}
          >
            <Box className='flex min-w-0 items-center gap-2'>
              <Box
                component='span'
                aria-hidden
                sx={{
                  width: 8,
                  height: 8,
                  flex: 'none',
                  borderRadius: `${radius.full}px`,
                  bgcolor: tab.dotColor,
                }}
              />
              <Typography
                variant='small'
                noWrap
                sx={{
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? 'text.primary' : 'customColors.inkSoft',
                }}
              >
                {t(tab.labelKey)}
                {tab.isDirty && (
                  <Box component='span' sx={{color: 'primary.main', ml: 1}}>
                    {t('escalationSettings.unsavedMark')}
                  </Box>
                )}
              </Typography>
            </Box>
            <Typography variant='caption' noWrap sx={{color: 'text.secondary'}}>
              {t('escalationSettings.stepCount', {count: tab.stepCount})}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default EscalationFlagTabs;
