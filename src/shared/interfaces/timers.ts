import {TypographyProps} from '@mui/material/Typography';

export interface ElapsedTimerProps extends Omit<TypographyProps, 'children'> {
  since: string;
}

export interface AlertAgeTimerProps extends Omit<TypographyProps, 'children'> {
  createdAt?: string | null;
  status?: string | null;
  resolvedAt?: string | null;
  acceptedAt?: string | null;
}
