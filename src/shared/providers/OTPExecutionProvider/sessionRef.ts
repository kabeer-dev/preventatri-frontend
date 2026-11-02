import {InitializeOtpSessionParams} from '@/shared/interfaces/auth';

let initializeOtpSessionRef:
  | ((params: InitializeOtpSessionParams) => void)
  | null = null;

export const setInitializeOtpSessionRef = ({
  fn,
}: {
  fn: (params: InitializeOtpSessionParams) => void;
}) => {
  initializeOtpSessionRef = fn;
};

export const getInitializeOtpSessionRef = () => initializeOtpSessionRef;
