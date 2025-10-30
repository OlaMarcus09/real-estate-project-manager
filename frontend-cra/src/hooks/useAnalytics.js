import { useCallback } from 'react';

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName, properties = {}) => {
    if (process.env.NODE_ENV === 'production') {
      // Here you can integrate with Google Analytics, Mixpanel, etc.
      console.log('Analytics Event:', eventName, properties);
    }
  }, []);

  return { trackEvent };
};
