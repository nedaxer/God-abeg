import { useQuery } from '@tanstack/react-query';

interface RecaptchaConfig {
  success: boolean;
  siteKey: string;
}

export function useRecaptchaConfig() {
  return useQuery<RecaptchaConfig>({
    queryKey: ['/api/config/recaptcha'],
    queryFn: async () => {
      const response = await fetch('/api/config/recaptcha');
      if (!response.ok) {
        throw new Error('Failed to fetch reCAPTCHA configuration');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour (v5 uses gcTime instead of cacheTime)
  });
}