# Review rules for preventatri-frontend

Every reviewer and verifier reads this file. When a type of finding keeps turning out wrong, or a real problem keeps slipping through, add a line here in the same PR that fixes it.

## Always check

- API calls go through `apiEndpoints.ts`, then `reactQueryConstants.ts`, then a `useQueries` or `useMutations` hook. Never axios or `useQuery` inside a component.
- New routes are registered in `src/shared/constants/paths.ts` with their `allowedRoles`.
- `index.tsx` holds logic and `XxxUI.tsx` only renders. A UI file that fetches data or holds business state is a finding.
- Navigation uses `useLocaleRouter` and the locale `Link`, never `useRouter` from `next/navigation` directly.
- Colors come from the theme palette. A hardcoded hex is a finding.
- Server data lives in React Query, not Redux.

## Not findings

- Frontend and backend constants may differ. The API maps between them.
- Anything ESLint, Prettier or tsc reports. The commit check blocks it already.
- Old code the PR didn't touch, unless the PR now depends on it. Put that under "Outside this diff".
