import {toast, ToastPosition} from 'react-hot-toast';

import {TOASTS_POSITION} from '@/shared/constants/toasts';
import {ShowToastProps} from '@/shared/interfaces/utils';

export const showToast = ({
  type = 'info',
  message,
  id,
  position = TOASTS_POSITION.TOP_RIGHT as ToastPosition,
}: ShowToastProps) => {
  const toastId = id || message;

  const options = {
    id: toastId as string,
    position,
  };

  switch (type) {
    case 'success':
      return toast.success(message, options);
    case 'error':
      return toast.error(message, options);
    case 'warning':
      // react-hot-toast doesn't have warning by default, use custom or icon
      return toast(message, {...options, icon: '⚠️'});
    case 'info':
    default:
      return toast(message, options);
  }
};

// Dismiss a specific toast
export const dismissToast = ({id}: {id: string | number}) => {
  toast.dismiss(id as string);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};
