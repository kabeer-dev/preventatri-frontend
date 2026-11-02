/**
 * Namespaces a set of nuqs URL param names with a per-instance prefix so that
 * multiple list-filter instances rendered on the same page don't share (and
 * fight over) the same query-string keys.
 *
 * Returns `undefined` when no prefix is provided, which tells nuqs to keep the
 * default (un-prefixed) URL keys — preserving behaviour for single-table pages.
 *
 * Example: buildUrlKeys({prefix: 'patientRedFlags', keys: ['number', 'limit']})
 *   => {number: 'patientRedFlags_number', limit: 'patientRedFlags_limit'}
 */
const buildUrlKeys = ({
  prefix,
  keys,
}: {
  prefix?: string;
  keys: string[];
}): Record<string, string> | undefined => {
  if (!prefix) return undefined;

  return Object.fromEntries(keys.map((key) => [key, `${prefix}_${key}`]));
};

export default buildUrlKeys;
