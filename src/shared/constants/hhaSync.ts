import {HhaSyncConfirmSection} from '@/shared/interfaces/hhaSync';

/** Wide enough for two-line bullets; BaseDialog caps it at 90vw on mobile. */
export const HHA_SYNC_CONFIRM_MODAL_WIDTH = 680;

/**
 * The Sync confirmation copy, grouped so an admin can scan it before starting
 * an import that overwrites live records. Order is deliberate: what arrives,
 * what survives untouched, then the caveats.
 */
export const HHA_SYNC_CONFIRM_SECTIONS: HhaSyncConfirmSection[] = [
  {
    titleKey: 'hhaSync.confirm.imported.title',
    icon: 'mdi:cloud-download-outline',
    color: 'primary',

    // Run order: people first, so patients can be linked to them.
    items: [
      {
        labelKey: 'hhaSync.confirm.imported.caseManagers.label',
        textKey: 'hhaSync.confirm.imported.caseManagers.text',
      },
      {
        labelKey: 'hhaSync.confirm.imported.nurses.label',
        textKey: 'hhaSync.confirm.imported.nurses.text',
      },
      {
        labelKey: 'hhaSync.confirm.imported.caregivers.label',
        textKey: 'hhaSync.confirm.imported.caregivers.text',
      },
      {
        labelKey: 'hhaSync.confirm.imported.patients.label',
        textKey: 'hhaSync.confirm.imported.patients.text',
      },
      {
        labelKey: 'hhaSync.confirm.imported.visits.label',
        textKey: 'hhaSync.confirm.imported.visits.text',
      },
    ],
  },
  {
    titleKey: 'hhaSync.confirm.untouched.title',
    icon: 'mdi:shield-lock-outline',
    color: 'success',
    items: [
      {
        labelKey: 'hhaSync.confirm.untouched.patients.label',
        textKey: 'hhaSync.confirm.untouched.patients.text',
      },
      {
        labelKey: 'hhaSync.confirm.untouched.caregivers.label',
        textKey: 'hhaSync.confirm.untouched.caregivers.text',
      },
      {
        labelKey: 'hhaSync.confirm.untouched.caseManagers.label',
        textKey: 'hhaSync.confirm.untouched.caseManagers.text',
      },
      {
        labelKey: 'hhaSync.confirm.untouched.nurses.label',
        textKey: 'hhaSync.confirm.untouched.nurses.text',
      },
    ],
  },
  {
    titleKey: 'hhaSync.confirm.beforeYouStart.title',
    icon: 'mdi:information-outline',
    color: 'info',
    items: [
      {
        labelKey: 'hhaSync.confirm.beforeYouStart.overwrite.label',
        textKey: 'hhaSync.confirm.beforeYouStart.overwrite.text',
      },
      {
        labelKey: 'hhaSync.confirm.beforeYouStart.background.label',
        textKey: 'hhaSync.confirm.beforeYouStart.background.text',
      },
      {
        labelKey: 'hhaSync.confirm.beforeYouStart.notification.label',
        textKey: 'hhaSync.confirm.beforeYouStart.notification.text',
      },
    ],
  },
];
