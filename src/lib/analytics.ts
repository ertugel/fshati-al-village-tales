// Google Analytics 4 helper for custom event tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export const trackBookingOpen = (itemName: string, itemType: string) => {
  trackEvent('booking_form_open', { item_name: itemName, item_type: itemType });
};

export const trackBookingSubmit = (itemName: string, totalPrice: number) => {
  trackEvent('booking_submission', { item_name: itemName, value: totalPrice, currency: 'EUR' });
};

export const trackLanguageToggle = (language: string) => {
  trackEvent('language_toggle_click', { language });
};

export const trackWhatsAppClick = () => {
  trackEvent('whatsapp_click');
};
