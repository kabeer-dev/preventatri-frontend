export const getTotalPages = ({
  rowCount,
  pageSize,
}: {
  rowCount: number;
  pageSize: number;
}): number => Math.max(1, Math.ceil(rowCount / Math.max(pageSize, 1)));

export const getPageRange = ({
  page,
  pageSize,
  rowCount,
}: {
  page: number;
  pageSize: number;
  rowCount: number;
}): {from: number; to: number} => {
  if (rowCount === 0) return {from: 0, to: 0};

  return {
    from: page * pageSize + 1,
    to: Math.min((page + 1) * pageSize, rowCount),
  };
};
