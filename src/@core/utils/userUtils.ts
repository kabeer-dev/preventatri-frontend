export const getInitials = ({name}: {name: string}) => {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0].charAt(0).toUpperCase();
  if (parts.length === 1) return first;
  const last = parts[parts.length - 1].charAt(0).toUpperCase();

  return first + last;
};
