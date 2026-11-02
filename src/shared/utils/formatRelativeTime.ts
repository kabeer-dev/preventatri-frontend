const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export const formatRelativeTime = ({
  dateString,
}: {
  dateString: string;
}): string => {
  const elapsedMs = Date.now() - new Date(dateString).getTime();

  if (elapsedMs < MINUTE_IN_MS) return 'just now';

  if (elapsedMs < HOUR_IN_MS) {
    const minutes = Math.floor(elapsedMs / MINUTE_IN_MS);

    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  if (elapsedMs < DAY_IN_MS) {
    const hours = Math.floor(elapsedMs / HOUR_IN_MS);

    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  const days = Math.floor(elapsedMs / DAY_IN_MS);

  return `${days} day${days > 1 ? 's' : ''} ago`;
};
