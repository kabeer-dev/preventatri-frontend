import {ThemeColor} from '@/@core/theme/types';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {NotificationDocumentType} from '@/shared/interfaces/notification';

export const NOTIFICATIONS_INFINITE_SCROLL = {
  // Page size per fetch; matches the backend's default list limit.
  pageLimit: 25,

  // Bottom buffer so the zero-height sentinel triggers a fetch before it reaches
  // the exact scroll edge (sub-pixel rounding leaves it just outside the root).
  observerRootMargin: '0px 0px 200px 0px',
  observerThreshold: 0,
} as const;

// Maps a notification's document type to the details page it links to.
export const NOTIFICATION_ROUTE_BUILDERS: Record<
  NotificationDocumentType,
  (id: string) => string
> = {
  FLAG: (id) => DASHBOARD_ROUTES.emergencyFlags.single({id}),
  FOLLOWUPTASK: (id) => DASHBOARD_ROUTES.followUps.single({id}),
  SUPERVISORYVISIT: (id) => DASHBOARD_ROUTES.supervisoryVisits.single({id}),
};

// Per-document-type icon + tint for the notification's leading badge. Icons
// mirror the sidebar nav so a notification reads as the same entity the user
// sees in the menu (Emergency Flags / Follow-up Tasks / Supervisory Visits).
export const NOTIFICATION_TYPE_ICONS: Record<
  NotificationDocumentType,
  {icon: string; color: ThemeColor}
> = {
  FLAG: {icon: 'mdi:flag', color: 'error'},
  FOLLOWUPTASK: {icon: 'mdi:clipboard-check-outline', color: 'info'},
  SUPERVISORYVISIT: {icon: 'mdi:calendar-check-outline', color: 'success'},
};

// Last resort when neither the title nor the type matches: a neutral bell.
export const FALLBACK_NOTIFICATION_ICON: {icon: string; color: ThemeColor} = {
  icon: 'mdi:bell-outline',
  color: 'secondary',
};

// Title-driven icon rules matched against the server-rendered (English) title.
// documentType only says FLAG — it can't tell a red flag from a yellow one — so
// the flag *shade* comes from the title ("Yellow flag …" → yellow). These also
// cover notifications the backend left untagged (documentType null) so they get
// the right icon instead of a bell. Ordered — the first matching rule wins, so
// the yellow-flag rule must precede the generic flag rule.
export const NOTIFICATION_TITLE_ICON_RULES: Array<{
  match: RegExp;
  icon: string;
  color: ThemeColor;
}> = [
  {match: /yellow[-\s]?flag/i, icon: 'mdi:flag', color: 'warning'},
  Object.assign({match: /flag/i}, NOTIFICATION_TYPE_ICONS.FLAG),
  Object.assign(
    {match: /follow[-\s]?up/i},
    NOTIFICATION_TYPE_ICONS.FOLLOWUPTASK
  ),
  Object.assign(
    {match: /supervisory|visit/i},
    NOTIFICATION_TYPE_ICONS.SUPERVISORYVISIT
  ),
];
