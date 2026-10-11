export type MetaPixelParams = Record<string, string | number | boolean | string[]>;

declare global {
  interface Window {
    fbq?: (
      command: 'track',
      eventName: string,
      params?: MetaPixelParams,
      options?: { eventID?: string },
    ) => void;
  }
}

export function trackMetaPixelEvent(
  eventName: string,
  params: MetaPixelParams,
  eventID?: string,
): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;

  try {
    window.fbq('track', eventName, params, eventID ? { eventID } : undefined);
  } catch {
    // Pixel failures must never interrupt shopping or checkout.
  }
}
