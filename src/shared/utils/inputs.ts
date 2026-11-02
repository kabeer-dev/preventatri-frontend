export const isEmptySelection = ({
  value,
}: {
  value: string | number | readonly string[] | null;
}): boolean =>
  value === null ||
  value === undefined ||
  value === '' ||
  (Array.isArray(value) && value.length === 0);
