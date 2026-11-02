import {FLAG_TO_SEVERITY} from '@/shared/constants/severity';
import {SeverityLevel} from '@/shared/types/severity';

export const getSeverityFromFlag = ({
  flag,
}: {
  flag?: string | null;
}): SeverityLevel | null => {
  const key = (flag ?? '').trim().toLowerCase();

  return FLAG_TO_SEVERITY[key] ?? null;
};
