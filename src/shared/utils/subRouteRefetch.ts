export const withSubRouteParam = ({
  endpoint,
  isSubRoute,
}: {
  endpoint: string;
  isSubRoute?: boolean;
}) => {
  if (!isSubRoute || endpoint.includes('isSubRoute=')) return endpoint;

  const separator = endpoint.includes('?') ? '&' : '?';

  return `${endpoint}${separator}isSubRoute=true`;
};
