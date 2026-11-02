'use client';

import {MouseEvent, useState} from 'react';

import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {useTranslation} from 'react-i18next';

import {CheckIcon} from '@/shared/components/icons';
import {
  setLanguageCookieInBrowser,
  getCurrentLanguage,
  getLanguageOptions,
} from '@/shared/utils/localeUtils';

const LANGUAGE_MENU_ID = 'language-switcher-menu';

const LanguageSwitcher = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {i18n} = useTranslation();

  const isOpen = Boolean(anchorEl);
  const languageOptions = getLanguageOptions();
  const currentLanguage = getCurrentLanguage({currentLocale: i18n.language});

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleChangeLocale = ({value}: {value: string}) => {
    handleClose();

    if (!value) return;

    setLanguageCookieInBrowser({language: value});

    i18n.changeLanguage(value).then(() => {
      window.location.reload();
    });
  };

  return (
    <>
      <Button
        aria-controls={isOpen ? LANGUAGE_MENU_ID : undefined}
        aria-haspopup='true'
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={handleOpen}
        className='w-full capitalize text-primary'
        sx={{bgcolor: 'background.paper'}}
      >
        {currentLanguage?.label}
      </Button>
      <Menu
        id={LANGUAGE_MENU_ID}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        slotProps={{
          paper: {className: 'w-max min-w-37.5'},
          list: {className: 'py-2'},
        }}
      >
        {languageOptions.map(({value, label}) => (
          <MenuItem
            key={value}
            selected={value === currentLanguage?.value}
            onClick={() => handleChangeLocale({value})}
          >
            <ListItemIcon>
              {value === currentLanguage?.value && <CheckIcon size={20} />}
            </ListItemIcon>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
