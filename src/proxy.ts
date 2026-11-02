import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';

import {i18nConfig} from '@/i18nConfig';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import {generateLocaleCookie} from '@/shared/utils/general';
import {getAuthTokenCookieName} from '@/shared/utils/getAuthTokenKey';
import {getRouteType} from '@/shared/utils/routeUtils';

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const {locales, defaultLocale} = i18nConfig;
  const newURL = new URL(request.url);
  let {pathname: newPath} = request.nextUrl;
  const cookieStore = await cookies();

  const cookieToken = cookieStore.get(getAuthTokenCookieName())?.value;

  const {isUnProtectedRoute} = getRouteType({pathname: newPath});

  // Redirect to login only if the user is trying to access a private page without a token
  if (!isUnProtectedRoute && !cookieToken) {
    const newRequestUrl = new URL(request.nextUrl.origin);
    newRequestUrl.pathname = AUTH_ROUTES.login();

    // Keep where they were headed (without the locale prefix), so a link from
    // an email brings them back after login.
    const requestedLocale = locales.find(
      (locale) => newPath.startsWith(`/${locale}/`) || newPath === `/${locale}`
    );

    newRequestUrl.searchParams.set(
      'returnUrl',
      requestedLocale ? newPath.replace(`/${requestedLocale}`, '') : newPath
    );

    const nextResponse = NextResponse.redirect(newRequestUrl);

    return nextResponse;
  }
  const cookieLocale = cookieStore.get('NEXTJS_LOCALE')?.value;

  // Ensure locale handling for all requests
  const selectedLocale = cookieLocale || defaultLocale;

  // Check if the URL already has a locale prefix
  // first condition to check all pages other than home which will be for example /en/dashboard
  // second condition to check home page that will not have the last / so will be for example /en
  const localePrefixFoundInURL = locales.find(
    (locale) => newPath.startsWith(`/${locale}/`) || newPath === `/${locale}`
  );

  if (localePrefixFoundInURL) {
    // Remove the locale prefix from the path, set the cookie, and redirect to the new path without the locale prefix
    // After the redirection, the middleware will be called again and the new path will be rewritten
    // with the locale prefix in the else branch of this flow
    // Example: /es/about -> sets `es` in cookies and redirects to -> /about

    newPath = newPath.replace(`/${localePrefixFoundInURL}`, '');
    newURL.pathname = newPath;

    const nextResponse = NextResponse.redirect(newURL);
    nextResponse.cookies.set(
      generateLocaleCookie({locale: localePrefixFoundInURL})
    );

    return nextResponse;
  }

  // selected locale is known either from the cookie (set before or just set in the if branch of this flow before redirecting) or the default locale
  // /about -> rewrite the url to add local without changing url from user perspective -> /es/about that still looks like /about
  newPath = `/${selectedLocale}${newPath}`;
  newURL.pathname = newPath;

  const nextResponse = NextResponse.rewrite(newURL);

  if (!cookieLocale) {
    nextResponse.cookies.set(generateLocaleCookie({locale: defaultLocale}));
  }

  return nextResponse;
}

export const config = {
  matcher: ['/:locale((?!api|_next|static|.*\\..*).*)'],
};
