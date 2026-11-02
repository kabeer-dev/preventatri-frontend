'use client';

import {useMemo} from 'react';

import {parseAsStringLiteral, useQueryState} from 'nuqs';

import {
  SETTINGS_SECTION_URL_KEY,
  SETTINGS_SECTIONS,
} from '@/shared/constants/settings';

import useTranslation from './useTranslation';
import useUserRole from './useUserRole';

// The settings page's selected section, kept in the URL. Shared by the page
// and the top-bar heading so both always name the same section.
export const useSettingsSection = () => {
  const {t} = useTranslation();
  const {isAdmin} = useUserRole();

  const sections = useMemo(
    () => SETTINGS_SECTIONS.filter((section) => isAdmin || !section.adminOnly),
    [isAdmin]
  );

  const [section, setSection] = useQueryState(
    SETTINGS_SECTION_URL_KEY,
    parseAsStringLiteral(sections.map(({value}) => value))
      .withDefault(sections[0].value)
      .withOptions({clearOnDefault: true})
  );

  const labelKey = sections.find(({value}) => value === section)?.labelKey;

  return {
    sections,
    section,
    setSection,
    sectionLabel: labelKey ? t(labelKey) : '',
  };
};

export default useSettingsSection;
