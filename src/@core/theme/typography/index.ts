import breakpoints from '@/@core/theme/breakpoints';

const typography = {
  fontFamily: 'var(--font-public-sans), sans-serif',

  display: {
    fontSize: '42px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 1.12,
  },
  h1: {
    fontSize: '27px',
    fontWeight: 800,
    letterSpacing: '-0.025em',
    lineHeight: 1.12,
  },
  h2: {
    fontSize: '19px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.4,
  },
  h3: {
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '-0.015em',
    lineHeight: 1.4,
  },
  metric: {
    fontSize: '36px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 1,
  },
  body: {
    fontSize: '14px',
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.55,
  },
  bodyStrong: {
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1.55,
  },
  small: {
    fontSize: '12.5px',
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.55,
  },
  eyebrow: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.07em',
    lineHeight: 1.4,
    textTransform: 'uppercase' as const,
  },
  mono: {
    fontFamily: 'var(--font-ibm-plex-mono), monospace',
    fontSize: '12.5px',
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: 1.55,
  },
  errorCode: {
    fontFamily: 'var(--font-ibm-plex-mono), monospace',
    fontSize: '88px',
    fontWeight: 500,
    letterSpacing: '-0.04em',
    lineHeight: 1,
    [`@media (min-width:${breakpoints().values.md}px)`]: {
      fontSize: '132px',
    },
  },

  body1: {
    fontSize: '14px',
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.55,
  },

  h4: {
    fontWeight: 500,
    letterSpacing: '0.25px',
  },
  h5: {
    fontWeight: 500,
    letterSpacing: 0,
  },
  h6: {
    letterSpacing: '0.15px',
  },
  subtitle1: {
    letterSpacing: '0.15px',
  },
  subtitle2: {
    letterSpacing: '0.1px',
  },
  body2: {
    lineHeight: 1.429,
    letterSpacing: '0.15px',
  },
  button: {
    letterSpacing: '0.4px',
  },
  caption: {
    lineHeight: 1.25,
    letterSpacing: '0.4px',
  },
  overline: {
    letterSpacing: '1px',
  },
};

export default typography;
