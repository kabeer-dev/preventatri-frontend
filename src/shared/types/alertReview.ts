import type {Palette} from '@mui/material/styles';

export type AnswerDisplay =
  | {kind: 'empty'}
  | {kind: 'boolean'; yes: boolean}
  | {kind: 'date'; iso: string}
  | {kind: 'text'; text: string};

export type CustomColorKey = keyof Palette['customColors'];
