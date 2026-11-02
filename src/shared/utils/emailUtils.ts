const HIDDEN_DOMAIN = '…';

export const maskEmail = ({email}: {email: string}) => {
  const atIndex = email.lastIndexOf('@');

  if (atIndex <= 0) return email;

  return `${email.slice(0, atIndex + 1)}${HIDDEN_DOMAIN}`;
};

const OBSCURED_LOCAL_PART_MASK = '•••••';

// Keeps the first and last two characters of the local part and the whole
// domain (k•••••98@gmail.com), so the user can recognise their address.
export const obscureEmail = ({email}: {email: string}) => {
  const atIndex = email.lastIndexOf('@');

  if (atIndex <= 0) return email;

  const localPart = email.slice(0, atIndex);

  if (localPart.length <= 3) return email;

  return `${localPart[0]}${OBSCURED_LOCAL_PART_MASK}${localPart.slice(-2)}${email.slice(atIndex)}`;
};
