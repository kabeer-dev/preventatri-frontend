import {jwtDecode, JwtPayload} from 'jwt-decode';

import {DecodeTokenResult} from '@/shared/types/utils';

export const decodeVerificationToken = ({
  token,
}: {
  token: string;
}): DecodeTokenResult => {
  const data: JwtPayload = jwtDecode(token);
  const currentTimestamp = new Date().getTime() / 1000;

  let hasExpired = false;

  if (data.exp !== undefined) {
    hasExpired = currentTimestamp > data.exp;
  }

  return {data, hasExpired};
};
