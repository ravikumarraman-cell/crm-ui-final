type ToastType = 'success' | 'info' | 'error' | 'warning';

export interface ToastEventDetail {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export const toast = {
  show(message: string, type: ToastType = 'info', duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const event = new CustomEvent<ToastEventDetail>('oneness-toast', {
      detail: { id, message, type, duration }
    });
    window.dispatchEvent(event);
    return id;
  },
  success(message: string, duration = 4000) {
    return this.show(message, 'success', duration);
  },
  info(message: string, duration = 4000) {
    return this.show(message, 'info', duration);
  },
  error(message: string, duration = 4000) {
    return this.show(message, 'error', duration);
  },
  warning(message: string, duration = 4000) {
    return this.show(message, 'warning', duration);
  }
};
