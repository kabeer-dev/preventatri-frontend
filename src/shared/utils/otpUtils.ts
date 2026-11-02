import {OtpMethodChoice, OtpMethods} from '@/shared/types/settings';

const PHONE_ENDING_LENGTH = 4;

export const getPhoneEnding = ({phone}: {phone: string}) =>
  phone.replace(/\D/g, '').slice(-PHONE_ENDING_LENGTH);

// Which of the card's choices the stored email/phone flags correspond to.
export const getOtpMethodChoice = ({
  otpMethods,
}: {
  otpMethods?: Pick<OtpMethods, 'email' | 'phone'>;
}): OtpMethodChoice | null => {
  if (!otpMethods) return null;
  if (otpMethods.email && otpMethods.phone) return 'both';
  if (otpMethods.phone) return 'phone';
  if (otpMethods.email) return 'email';

  return null;
};
