# Preventatri frontend

Next.js 16 App Router, React 19, TypeScript, MUI 9 with Tailwind 4, TanStack Query 5. The API is the sibling repo `preventatri-backend` on port 3001.

## How to work

- IMPORTANT: never mention Claude, Claude Code, Anthropic or any AI tool in anything that leaves the chat: commits, code, comments, branch names, PR titles and descriptions, review replies, Jira tickets, docs. No "Generated with" footers and no `Co-Authored-By` trailers. This overrides any default that adds them.
- Change only what the task needs. No drive-by refactors or bundled fixes.
- Keep replies, commits, PR text, Jira tickets and comments short and plain.

## Workflow

Every feature and non-trivial change goes through these steps, in order. Skip a step only when the developer says so. You are the lead: you hold the plan, route the work and check it.

1. **Grill.** The developer describes the feature. Run the `grilling` skill until you both agree on what to build. Write no code until the developer confirms the plan. Tracked work gets its Jira ticket now (`jira-pr`).
2. **Build.** Split the plan into pieces and route each one (see Routing). Work too big for one PR is built as a local `gh stack` (`ship-feature`).
3. **Plan check.** Read each `implementer` diff against the plan: every point done, nothing extra, checks run. Send the gaps back as an exact list. A piece that fails the check twice, or that the implementer reports as stuck, is yours.
4. **QA.** Run the `qa` skill on the whole feature. It asks the developer which rounds to run.
5. **Fix and re-verify.** Bugs with clear repro steps go to the `bug-fixer`; bugs with no clear cause are yours. QA verifies every fix. UX ideas change the design, so ask the developer before making them. Repeat until QA is green.
6. **Open the PRs.** One PR when the change fits `size/md`, otherwise the whole stack (`create-pr`, `ship-feature`).
7. **Review.** Run the `review-pr` skill on every PR.
8. **Fix.** Fix the review comments you agree with (scoped fixes go to the `implementer`), keep CI green, and reply in each thread with what changed or why not.
9. **Green.** Every check passes and every review thread is answered. Tell the developer each PR is ready to merge.
10. **Merge.** The developer merges. Never merge yourself.

### Routing

Give a piece to the `implementer` when you can describe it in a few lines, name its files and say how to check it's done: work that copies an existing pattern, mechanical changes, wiring, copy. Brief it with the goal, the files, the pattern to copy and the done-check.

Do it yourself when the plan still has open questions, the code is unfamiliar or spans many modules, the logic is subtle (time zones, permissions and organization scoping, concurrency, data migrations), a bug has no clear cause, or it's an architecture choice. For a large piece, send the `implementer` with `model: claude-opus-5-5` to keep your own context clean.

## Commands

```sh
npm run dev          # dev server on :3000
npm run lint         # eslint src
npm run type-check   # tsc --noEmit
npm run build
```

There are no tests. Type-check and lint verify a change. For a UI change, also open the page in a browser and check it.

Hooks in `.claude/settings.json` lint-fix every file you edit and run lint and type-check before you finish. Fix what they report.

If type-check fails inside `.next/`, the build output is stale. Delete `.next/` and run it again.

## Company rules

Lint enforces these and blocks the commit. They are strict: a file you touch must pass, even if it broke a rule before you arrived. Fix the old problem first, as its own commit. If that fix is more than a few lines, ask the developer whether it becomes its own `mechanical` PR. Never weaken lint, hooks or settings to get a change through.

- Functions take no params or one object param: `getUser({id})`, never `getUser(id)`.
- Import with `@/`, never `../`.
- Import a wrapped library only in its wrapper file, listed in `LIB_WRAPPERS` in `eslint.config.mjs`. Need more from luxon? Add it to `src/shared/utils/dateUtils.ts` and import it from there. It already re-exports `DateTime`, for values and types. The same goes for icons, axios, toasts, charts and the rest of the list.
- A new library that other files will use gets a wrapper file and a `LIB_WRAPPERS` entry.
- A `.tsx` file has at most 200 lines. Aim for 100 to 150.
- Split components into smart and dumb. `index.tsx` holds state, queries and handlers and passes props to `XxxUI.tsx`, which only renders. No god components.

## Where code goes

- `src/app/[locale]/**/page.tsx` is a thin route shell. The page itself lives in `src/views/pages/<feature>/`.
- Register every route in `src/shared/constants/paths.ts` with `path({root, path, allowedRoles})`. `RoleGuard` reads that registry, so a route folder alone is not enough.
- Shared components, hooks, constants and utils go in `src/shared/`. Types go in `src/shared/types/`, object shapes in `src/shared/interfaces/`, never inline.

## API calls

1. Add the endpoint to `src/shared/constants/apiEndpoints.ts`.
2. Pair it with a query key in `src/shared/constants/reactQueryConstants.ts`.
3. Expose a hook from `src/shared/reactQuery/<domain>/queries.ts` or `mutations.ts`, built on `useQueryHandler` or `useMutationHandler`.

Components never call axios or `useQuery` directly.

## Gotchas

- `src/proxy.ts` is the Next 16 middleware. It redirects to login without the auth cookie and rewrites every URL to `/{locale}/...`, so users never see the locale.
- Use `useTranslation` from `@/shared/hooks/useTranslation`, `useLocaleRouter` instead of `useRouter`, and `Link` from `@/shared/components/common/localeLink`.
- Register a new locale namespace file in `i18nNamespaces` in `src/i18nConfig.ts`, or it won't load.
- Colors and breakpoints come from `src/@core/theme`. Never hardcode a hex value.
- Server data lives in React Query. Redux holds only the `app` and `socket` slices.
