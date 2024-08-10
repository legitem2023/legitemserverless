// utils/toastUtils.ts
import { toast } from 'react-toastify';

export const showToast = (type: 'success' | 'error', message: string) => {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    default:
      toast(message);
  }
};
