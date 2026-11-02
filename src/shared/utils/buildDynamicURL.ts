import {BuildDynamicUrlArgs} from '@/shared/types/utils';

export const buildDynamicURL = ({
  baseEndpoint,
  params,
}: BuildDynamicUrlArgs) => {
  // Return early if baseEndpoint is missing or empty
  if (!baseEndpoint?.trim()) return '';
  if (!params) return baseEndpoint;

  // Filter out invalid parameters:
  // - Exclude null and undefined values (meaning no data)
  // - Exclude empty strings (to avoid sending meaningless query params)
  // - Keep valid numbers (including 0, negative) and booleans
  const validEntries = Object.entries(params).filter(
    ([, value]) =>
      value !== undefined &&
      value !== null &&
      !(typeof value === 'string' && value.trim() === '')
  );

  // If no valid params remain, just return the base endpoint
  if (!validEntries.length) return baseEndpoint;

  // Build a properly encoded query string from valid params
  const queryString = new URLSearchParams(
    validEntries.map(([key, value]) => [key, value.toString()])
  ).toString();

  // Return the final URL with query params appended
  return `${baseEndpoint}?${queryString}`;
};
