'use client';

import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';

import useTranslation from '@/shared/hooks/useTranslation';
import {SettingsNavProps} from '@/shared/interfaces/settings';

const SettingsNav = ({sections, value, onChange}: SettingsNavProps) => {
  const {t} = useTranslation();

  return (
    <Card component='nav' aria-label={t('sections.ariaLabel')}>
      <List disablePadding className='flex flex-col gap-0.5 p-1.5'>
        {sections.map((section) => {
          const isActive = section.value === value;

          return (
            <ListItemButton
              key={section.value}
              selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onChange(section.value)}
              className='rounded-md px-2.5 py-2 text-sm'
              sx={{
                color: isActive ? 'text.primary' : 'text.secondary',
                fontWeight: isActive ? 600 : 400,
                '&.Mui-selected, &.Mui-selected:hover': {
                  backgroundColor: 'customColors.brandTint',
                },
              }}
            >
              {t(section.labelKey)}
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );
};

export default SettingsNav;
