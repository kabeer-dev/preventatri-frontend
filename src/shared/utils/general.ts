import {ReadonlyHeaders} from 'next/dist/server/web/spec-extension/adapters/headers';

import {
  BARE_DIAL_CODE_PATTERN,
  PHONE_NUMBER_STRIP_PATTERN,
  STATS_FALLBACK,
  SYSTEM_ROLES,
  SystemRoleValue,
} from '@/shared/constants/common';
import {User} from '@/shared/interfaces/auth';

/**
 * Normalise a phone number to the shared storage shape: keep the digits and a
 * single leading "+", drop every other character, and collapse empty input or
 * a bare dial code ("+1") to null. Mirrors normalizePhoneNumber on the backend
 * so what passes the form is exactly what the API stores.
 */
export const normalizePhoneNumber = ({
  value,
}: {
  value?: string | null;
}): string | null => {
  if (value === null || value === undefined) return null;

  const compact = String(value).replace(PHONE_NUMBER_STRIP_PATTERN, '');
  const hasLeadingPlus = compact.startsWith('+');
  const digits = compact.replace(/\+/g, '');
  const normalized = hasLeadingPlus ? `+${digits}` : digits;

  if (digits === '' || BARE_DIAL_CODE_PATTERN.test(normalized)) return null;

  return normalized;
};

export const getBaseUrl = ({
  headersList,
}: {
  headersList?: Headers | ReadonlyHeaders;
}) => {
  if (typeof window !== 'undefined') return window.location.origin;

  const host = headersList?.get('host');
  const protocol = host?.startsWith('localhost') ? 'http' : 'https';

  return host ? `${protocol}://${host}` : '';
};

export function generateLocaleCookie({locale}: {locale: string}) {
  return {
    name: 'NEXTJS_LOCALE',
    value: locale,
    options: {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  };
}

/**
 * Converts an object whose values contain `{ label, value }` pairs
 * into an array of `{ label, value }` options.
 *
 * @param {Object} params
 * @param {Record<string, { label: any; value: any }>} params.obj
 * An object where each key maps to an option definition.
 *
 * @returns {{ label: any; value: any }[]}
 * An array of options formatted as `{ label, value }`.
 *
 * @example
 * const options = createOptionsFromObject({
 *   obj: {
 *     name: { label: 'Name', value: 'name' },
 *     age: { label: 'Age', value: 25 },
 *     active: { label: 'Active', value: true },
 *   },
 * });
 * // => [
 * //   { label: 'Name', value: 'name' },
 * //   { label: 'Age', value: 25 },
 * //   { label: 'Active', value: true }
 * // ]
 */
export function createOptionsFromObject({
  obj,
}: {
  obj: Record<string, {label: any; value: any}>;
}): {label: any; value: any}[] {
  return Object.values(obj).map(({label, value}) => ({label, value}));
}

/**
 * Extracts specific property values from an object of objects.
 *
 * @param {Object} params
 * @param {Record<string, any>} params.obj - The source object.
 * @param {string} [params.key='value'] - The key to extract from each inner object.
 *
 * @returns {any[]} An array of extracted values.
 *
 * @example
 * const USER_ROLES = {
 *   admin: { value: 'admin', access: { dashboard: true } },
 *   user: { value: 'user', access: { dashboard: false } },
 * };
 *
 * getValuesFromObj({ obj: USER_ROLES });
 * // => ['admin', 'user']
 *
 * getValuesFromObj({ obj: USER_ROLES, key: 'access' });
 * // => [{ dashboard: true }, { dashboard: false }]
 */
export function getValuesFromObj({
  obj = {},
  key = 'value',
}: {
  obj: Record<string, any>;
  key?: string;
}): any[] {
  return Object.values(obj).map((item) => item?.[key]);
}

export const padNumber = ({n}: {n: number}) => String(n).padStart(2, '0');

/**
 * "Dorothy Kline", or "Kline, Dorothy" with `lastFirst`: the order every
 * caregiver list sorts and reads by.
 */
export const getFullName = ({
  firstName,
  lastName,
  lastFirst = false,
}: {
  firstName?: string | null;
  lastName?: string | null;
  lastFirst?: boolean;
}): string => {
  const first = (firstName || '').trim();
  const last = (lastName || '').trim();

  if (lastFirst) return [last, first].filter(Boolean).join(', ');

  return `${first} ${last}`.trim();
};

/**
 * Resolves a stats-card value, showing a placeholder while the request is
 * loading or when the value is unavailable. Used by the listing-page stats
 * cards (nurses, patients, case managers).
 */
export const resolveStat = ({
  value,
  isLoading,
  fallback = STATS_FALLBACK,
}: {
  value?: number;
  isLoading?: boolean;
  fallback?: string;
}): number | string => (isLoading || value === undefined ? fallback : value);

export const getSystemRoleLabel = ({
  role,
}: {
  role: SystemRoleValue | string | null | undefined;
}): string | undefined =>
  Object.values(SYSTEM_ROLES).find((r) => r.value === role)?.label;

export const getUserDisplayName = ({
  user,
}: {
  user: Pick<User, 'firstName' | 'lastName' | 'email'> | null | undefined;
}): string => {
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  return user?.email || 'User';
};

export const getOrgRoleLabel = ({
  role,
}: {
  role: SystemRoleValue | string | null | undefined;
}): string | undefined =>
  Object.values(SYSTEM_ROLES).find((r) => r.value === role)?.orgLabel;
