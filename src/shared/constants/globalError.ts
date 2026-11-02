// English only: global-error.tsx replaces the root layout, so the translation
// provider is not mounted when this screen renders.
export const GLOBAL_ERROR_COPY = {
  code: '500',
  title: "Preventatri couldn't load",
  message:
    'Something went wrong while starting the app. Nothing in your records was changed. Reload the page to try again.',
  goBack: 'Go back',
  reloadPage: 'Reload page',
} as const;
