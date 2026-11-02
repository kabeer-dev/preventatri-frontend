'use client';

import {useState, useEffect, useRef} from 'react';

import {userMutations} from '@/shared/reactQuery';
import {decodeVerificationToken} from '@/shared/utils/jwtUtils';
import {asyncTryCatch, tryCatch} from '@/shared/utils/tryCatchUtils';

const useVerifyUser = ({token}: {token: string}) => {
  const [isRequestPending, setIsRequestPending] = useState(true);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const [unVerifiedEmail, setUnVerifiedEmail] = useState('');
  const {useVerifyUserMutation} = userMutations();

  // `mutateAsync` keeps one identity across renders, unlike `mutate`, so the
  // effect below runs once per token and the real API result is awaited.
  const {mutateAsync: executeVerifyUserMutation} = useVerifyUserMutation();

  // The link is single use: a second request, such as the dev double effect,
  // would be rejected.
  const verifiedTokenRef = useRef('');

  useEffect(() => {
    if (verifiedTokenRef.current === token) return;

    verifiedTokenRef.current = token;

    const verify = async () => {
      setIsRequestPending(true);

      // Attempt to decode the verification token
      const {success, error, response} = tryCatch({
        fn: () => decodeVerificationToken({token}),
      });

      if (!success) {
        setTokenError(error);
        setIsRequestPending(false);

        return;
      }

      if (response) {
        const {
          hasExpired,
          data: {email},
        } = response;

        setUnVerifiedEmail(email);

        if (!hasExpired) {
          const {success: userVerifiedSuccess, error: verifyError} =
            await asyncTryCatch({
              fn: async () =>
                executeVerifyUserMutation({
                  params: {token},
                }),
            });

          if (userVerifiedSuccess) {
            setIsUserVerified(true);
          } else {
            setTokenError(verifyError);
          }
        } else {
          setIsTokenExpired(true);
        }
      }

      setIsRequestPending(false);
    };

    verify();
  }, [token, executeVerifyUserMutation]);

  return {
    isRequestPending,
    isTokenExpired,
    isUserVerified,
    tokenError,
    unVerifiedEmail,
  };
};

export default useVerifyUser;
