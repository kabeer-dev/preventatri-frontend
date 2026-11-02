import {redirect} from 'next/navigation';

import {AUTH_ROUTES} from '@/shared/constants/paths';

export default function page() {
  redirect(AUTH_ROUTES.login());
}
