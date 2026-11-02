import {
  RESTORED_RETURN_URL_KEY,
  RESTORED_RETURN_URL_TTL_MS,
} from '@/shared/constants/session';

export const getSafeReturnUrl = ({
  returnUrl,
}: {
  returnUrl: string | null;
}): string | null => {
  if (!returnUrl) return null;

  try {
    const decoded = decodeURIComponent(returnUrl);
    if (!decoded.startsWith('/')) return null;
    if (decoded.startsWith('//')) return null;
    if (decoded.includes('://')) return null;

    return decoded;
  } catch {
    return null;
  }
};

export const markReturnUrlRestored = (): void => {
  try {
    sessionStorage.setItem(RESTORED_RETURN_URL_KEY, String(Date.now()));
  } catch {
    // Storage can be blocked; the redirect is a convenience only.
  }
};

export const consumeRestoredReturnUrl = (): boolean => {
  try {
    const savedAt = Number(sessionStorage.getItem(RESTORED_RETURN_URL_KEY));

    sessionStorage.removeItem(RESTORED_RETURN_URL_KEY);

    return savedAt > 0 && Date.now() - savedAt < RESTORED_RETURN_URL_TTL_MS;
  } catch {
    return false;
  }
};
