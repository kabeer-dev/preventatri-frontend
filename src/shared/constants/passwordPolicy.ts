import {PasswordRule} from '@/shared/interfaces/inputs';

export const PASSWORD_MIN_LENGTH = 12;

export const PASSWORD_MAX_LENGTH = 64;

const SYMBOL_PATTERN = /[!@#$%^&*()[\]{}\-_+=~`|:;"'<>,.?/\\]/;

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: 'length',
    messageKey: 'authValidation.passwordRuleLength',
    isMet: ({value}) =>
      value.length >= PASSWORD_MIN_LENGTH &&
      value.length <= PASSWORD_MAX_LENGTH,
  },
  {
    id: 'case',
    messageKey: 'authValidation.passwordRuleCase',
    isMet: ({value}) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  {
    id: 'number',
    messageKey: 'authValidation.passwordRuleNumber',
    isMet: ({value}) => /\d/.test(value),
  },
  {
    id: 'symbol',
    messageKey: 'authValidation.passwordRuleSymbol',
    isMet: ({value}) => SYMBOL_PATTERN.test(value),
  },
];
