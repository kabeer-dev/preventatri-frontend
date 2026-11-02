export const RISK_FLAGS = {
  RED: 'red',
  YELLOW: 'yellow',
  AMBER: 'amber',
  GREEN: 'green',
} as const;

export const PAIN_LEVEL_SCORE = {
  MIN_VALUE: 0,
  MAX_VALUE: Infinity,
  RED_THRESHOLD: 7,
  YELLOW_THRESHOLD: 4,
  RED_POINTS: 20,
  YELLOW_POINTS: 5,
  GREEN_POINTS: 0,
} as const;
